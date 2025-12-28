import { type User, type RegisterUser, type Transaction, type InsertTransaction } from "@shared/schema";
import { sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: RegisterUser & { password: string }): Promise<User>;
  getAllUsers(): Promise<User[]>;
  approveUser(userId: string): Promise<User | undefined>;
  rejectUser(userId: string): Promise<User | undefined>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Transaction methods
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction, userId: string): Promise<Transaction>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;
}

// Reference: blueprint:javascript_database for PostgreSQL setup
import { db } from "./db";
import { users, transactions } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: RegisterUser & { password: string }): Promise<User> {
    // Everything inside transaction with table-level locking
    return await db.transaction(async (tx) => {
      // Acquire exclusive lock on users table to prevent race conditions
      // SHARE ROW EXCLUSIVE MODE prevents concurrent inserts
      await tx.execute(sql`LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE`);
      
      // Check if they're the first user
      const allUsers = await tx.select().from(users).limit(1);
      const isFirstUser = allUsers.length === 0;

      const [user] = await tx
        .insert(users)
        .values({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          // First user is automatically admin and approved
          ...(isFirstUser && {
            isAdmin: "true",
            approved: "approved",
          }),
        })
        .returning();
      
      return user;
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async approveUser(userId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ approved: "approved", updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async rejectUser(userId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ approved: "rejected", updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });
    
    return result.length > 0;
  }

  // Transaction methods
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction, userId: string): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({ ...insertTransaction, userId })
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning({ id: transactions.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
