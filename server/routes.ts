import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isApproved, isAdmin, hashPassword, verifyPassword } from "./auth";
import { insertTransactionSchema, registerUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Rate limiters for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
    message: "Too many authentication attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Auth routes
  app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // For first user (auto-approved admin), log them in immediately
      if (user.approved === "approved" && user.isAdmin === "true") {
        req.session.userId = user.id;
        return res.status(201).json({ 
          message: "Registration successful. You are the admin.",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            approved: user.approved,
            isAdmin: user.isAdmin,
          }
        });
      }

      // For subsequent users, return pending status
      res.status(201).json({ 
        message: "Registration successful. Awaiting admin approval.",
        status: "pending"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check approval status
      if (user.approved === "rejected") {
        return res.status(403).json({ message: "Your account has been rejected" });
      }

      if (user.approved === "pending") {
        return res.status(403).json({ message: "Your account is pending approval" });
      }

      // Create session
      req.session.userId = user.id;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          approved: user.approved,
          isAdmin: user.isAdmin,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        approved: user.approved,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users/:userId/approve", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.approveUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ message: "Failed to approve user" });
    }
  });

  app.post("/api/admin/users/:userId/reject", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.rejectUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error rejecting user:", error);
      res.status(500).json({ message: "Failed to reject user" });
    }
  });

  app.delete("/api/admin/users/:userId", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.session.userId!;

      // Prevent admins from deleting themselves
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Transaction routes (all protected and require approval)
  app.get("/api/transactions", isAuthenticated, isApproved, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", isAuthenticated, isApproved, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Remove any userId from request body to prevent injection
      const { userId: _ignored, ...bodyData } = req.body;
      const validatedData = insertTransactionSchema.parse(bodyData);
      const transaction = await storage.createTransaction(validatedData, userId);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  app.delete("/api/transactions/:id", isAuthenticated, isApproved, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { id } = req.params;
      const deleted = await storage.deleteTransaction(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found or not authorized" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  app.get("/api/transactions/export/xml", isAuthenticated, isApproved, async (req, res) => {
    try {
      const userId = req.session.userId!;

      // Validate and sanitize date parameters
      const startDate = typeof req.query.startDate === 'string' ? req.query.startDate.trim() : undefined;
      const endDate = typeof req.query.endDate === 'string' ? req.query.endDate.trim() : undefined;
      
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && !dateRegex.test(startDate)) {
        return res.status(400).json({ message: "Invalid start date format. Use YYYY-MM-DD" });
      }
      if (endDate && !dateRegex.test(endDate)) {
        return res.status(400).json({ message: "Invalid end date format. Use YYYY-MM-DD" });
      }
      
      // Get all transactions for the user
      let transactions = await storage.getTransactions(userId);
      
      // Filter by date range if provided
      if (startDate) {
        transactions = transactions.filter(t => t.date >= startDate);
      }
      if (endDate) {
        transactions = transactions.filter(t => t.date <= endDate);
      }

      // Get user info for the XML
      const user = await storage.getUser(userId);

      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const netProfit = totalIncome - totalExpense;

      // Generate XML with proper sanitization
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<FinancialReport>
  <Organization>
    <Name>Profit Pilot</Name>
    <ReportGeneratedBy>${escapeXml(user?.firstName || '')} ${escapeXml(user?.lastName || '')}</ReportGeneratedBy>
    <Email>${escapeXml(user?.email || '')}</Email>
    <GeneratedDate>${new Date().toISOString()}</GeneratedDate>
  </Organization>
  <DateRange>
    <StartDate>${escapeXml(startDate || 'All')}</StartDate>
    <EndDate>${escapeXml(endDate || 'All')}</EndDate>
  </DateRange>
  <Summary>
    <TotalIncome currency="BDT">${totalIncome.toFixed(2)}</TotalIncome>
    <TotalExpense currency="BDT">${totalExpense.toFixed(2)}</TotalExpense>
    <NetProfit currency="BDT">${netProfit.toFixed(2)}</NetProfit>
    <TransactionCount>${transactions.length}</TransactionCount>
  </Summary>
  <Transactions>
${transactions.map(t => `    <Transaction>
      <ID>${escapeXml(t.id)}</ID>
      <Type>${escapeXml(t.type)}</Type>
      <Date>${escapeXml(t.date)}</Date>
      <Category>${escapeXml(t.category)}</Category>
      <Amount currency="BDT">${escapeXml(t.amount)}</Amount>
      <Description>${escapeXml(t.description)}</Description>
      <CreatedAt>${t.createdAt ? new Date(t.createdAt).toISOString() : ''}</CreatedAt>
    </Transaction>`).join('\n')}
  </Transactions>
</FinancialReport>`;

      // Sanitize filename - allow only alphanumeric, hyphen, underscore
      const safeStartDate = startDate ? startDate.replace(/[^A-Za-z0-9-]/g, '') : 'all';
      const safeEndDate = endDate ? endDate.replace(/[^A-Za-z0-9-]/g, '') : 'all';
      const filename = `arena-web-security-${safeStartDate}-to-${safeEndDate}.xml`;
      
      // Security headers for sensitive export
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(xml);
    } catch (error) {
      console.error("Error exporting transactions:", error);
      res.status(500).json({ message: "Failed to export transactions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
