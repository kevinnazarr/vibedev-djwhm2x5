"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import {
  GAME_STATUSES,
  PLATFORMS,
  type GameStatus,
  type Platform,
} from "@/types/game";
import { PLATFORM_META, STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  type SelectOption,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/game/status-badge";

const gameFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter the game title")
    .max(100, "Title must be under 100 characters"),
  platform: z.enum([...PLATFORMS]),
  status: z.enum([...GAME_STATUSES]),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

export interface NewGameInput {
  title: string;
  platform: Platform;
  status: GameStatus;
}

const platformOptions: SelectOption[] = PLATFORMS.map((platform) => ({
  value: platform,
  label: platform,
}));

const statusOptions: SelectOption[] = GAME_STATUSES.map((status) => ({
  value: status,
  label: status,
  description: STATUS_META[status].description,
}));

export function AddGameForm({
  onAdd,
}: {
  onAdd: (input: NewGameInput) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: { title: "", platform: "PC", status: "Not Started" },
    mode: "onSubmit",
  });

  function onSubmit(values: GameFormValues) {
    onAdd(values);
    reset({ title: "", platform: values.platform, status: values.status });
  }

  const titleError = errors.title?.message;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a game</CardTitle>
        <CardDescription>
          Log a new game to your backlog and pick its starting status.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="game-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="game-title"
              placeholder="e.g. Elden Ring"
              autoComplete="off"
              data-invalid={titleError ? true : undefined}
              aria-invalid={titleError ? true : undefined}
              aria-describedby={titleError ? "game-title-error" : undefined}
              {...register("title")}
            />
            {titleError ? (
              <p
                id="game-title-error"
                role="alert"
                className="text-xs font-medium text-destructive"
              >
                {titleError}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="game-platform"
                className="text-sm font-medium text-foreground"
              >
                Platform
              </label>
              <Controller
                control={control}
                name="platform"
                render={({ field }) => (
                  <Select
                    id="game-platform"
                    value={field.value}
                    onChange={field.onChange}
                    options={platformOptions}
                    aria-label="Platform"
                    renderOption={(option) => {
                      const platform = option.value as Platform;
                      const meta = PLATFORM_META[platform];
                      const Icon = meta.icon;
                      return (
                        <span className="flex items-center gap-2">
                          <Icon className={cn("size-4", meta.accent)} />
                          {option.label}
                        </span>
                      );
                    }}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="game-status"
                className="text-sm font-medium text-foreground"
              >
                Status
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    id="game-status"
                    value={field.value}
                    onChange={field.onChange}
                    options={statusOptions}
                    aria-label="Status"
                    renderOption={(option) => (
                      <StatusBadge status={option.value as GameStatus} />
                    )}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" data-icon="inline-start" />
            Add to backlog
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
