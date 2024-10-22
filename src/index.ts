import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

const MOCK_API_URL = process.env.MOCK_API_URL || 'https://mockapi.io/api/v1/expenses';

// Define Expense type
type Expense = {
  id: string;
  title: string;
  nominal: number;
  type: "income" | "expense";
  category: "salary" | "food" | "transport";
  date: string;
};

// Get expense list
app.get("/expenses", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(MOCK_API_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Get expense details by ID
app.get("/expenses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${MOCK_API_URL}/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
});

// Create new expense
app.post("/expenses", async (req: Request, res: Response) => {
  const { title, nominal, type, category, date }: Expense = req.body;
  try {
    const response = await axios.post(MOCK_API_URL, { title, nominal, type, category, date });
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
});

// Edit expense
app.put("/expenses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, nominal, type, category, date }: Expense = req.body;
  try {
    const response = await axios.put(`${MOCK_API_URL}/${id}`, { title, nominal, type, category, date });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
});

// Delete expense
app.delete("/expenses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await axios.delete(`${MOCK_API_URL}/${id}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});

// Get total expense by date range
app.get("/expenses/date-range", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  try {
    const response = await axios.get(MOCK_API_URL);
    const expenses = response.data as Expense[];

    const total = expenses
      .filter((e) => new Date(e.date) >= new Date(startDate as string) && new Date(e.date) <= new Date(endDate as string))
      .reduce((sum, e) => sum + e.nominal, 0);

    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses by date range", error });
  }
});

// Get total expense by category
app.get("/expenses/category/:category", async (req: Request, res: Response) => {
  const { category } = req.params;
  try {
    const response = await axios.get(MOCK_API_URL);
    const expenses = response.data as Expense[];

    const total = expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.nominal, 0);

    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses by category", error });
  }
});

// Use PORT from .env, defaulting to 8080 if not found
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
