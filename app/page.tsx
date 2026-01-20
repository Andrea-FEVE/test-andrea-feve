"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Database, Layers, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "pm-frontend-todos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Todo[];
        if (Array.isArray(parsed)) {
          setTodos(parsed);
          setHasLoaded(true);
          return;
        }
      } catch {
        // Ignore malformed localStorage and fall back to defaults.
      }
    }

    setTodos([
      { id: "next", text: "Next.js", done: false },
      { id: "react", text: "React", done: false },
      { id: "tailwind", text: "Tailwind CSS", done: false },
      { id: "shadcn", text: "shadcn/ui", done: false },
    ]);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [hasLoaded, todos]);

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newTodo.trim();
    if (!trimmed) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setTodos((current) => [
      ...current,
      { id, text: trimmed, done: false },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-muted/40 px-6 py-12 text-foreground">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tests front-end
            </p>
            <h1 className="text-3xl font-semibold leading-tight">
              Todo list des technologies installees
            </h1>
            <p className="text-sm text-muted-foreground">
              LocalStorage sert de base de donnees pour vos checks.
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Infos projet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Infos rapides</SheetTitle>
                <SheetDescription>
                  Resume des technos et de la persistance locale.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 text-sm text-muted-foreground">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Stack installee
                  </p>
                  {["Next.js", "React", "Tailwind CSS", "shadcn/ui"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-foreground"
                      >
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    )
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Stockage local
                  </p>
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-foreground">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Cle : {STORAGE_KEY}
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter un test ou une techno</CardTitle>
            <CardDescription>
              Liste simple pour vos checks front-end.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={addTodo} className="flex flex-col gap-3 sm:flex-row">
              <label className="w-full">
                <span className="sr-only">Ajouter un element</span>
                <Input
                  value={newTodo}
                  onChange={(event) => setNewTodo(event.target.value)}
                  placeholder="Ajouter une techno ou un scenario de test"
                />
              </label>
              <Button type="submit">Ajouter</Button>
            </form>

            <Separator />

            <div className="space-y-3">
              {todos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun element pour le moment.
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3"
                  >
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className="flex flex-1 items-center gap-3"
                    >
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.done}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span
                        className={`text-sm font-medium ${
                          todo.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              {hasLoaded ? "LocalStorage synchronise" : "Chargement..."}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
