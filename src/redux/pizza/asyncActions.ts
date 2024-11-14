import axios from "axios";
import { Pizza } from "./types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPizzas = createAsyncThunk<Pizza[], string>(
  "pizza/fetchPizzasStatus",
  async (url) => {
    const { data } = await axios.get<Pizza[]>(url);
    return data;
  }
);
