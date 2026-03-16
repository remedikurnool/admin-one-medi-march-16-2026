"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  type AdvancedFilterField,
  type AdvancedFilterRule,
  type FilterOperator,
  type FilterFieldType,
} from "@/types/data-table"

interface DataTableAdvancedFiltersProps<TData> {
  fields: AdvancedFilterField<TData>[]
  filters: AdvancedFilterRule[]
  onFiltersChange: (filters: AdvancedFilterRule[]) => void
  open: boolean
}

const operatorsByType: Record<FilterFieldType, { value: FilterOperator; label: string }[]> = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "gt", label: "Greater than" },
    { value: "lt", label: "Less than" },
    { value: "gte", label: "Greater or equal" },
    { value: "lte", label: "Less or equal" },
  ],
  date: [
    { value: "equals", label: "Is" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "between", label: "Between" },
  ],
  select: [
    { value: "equals", label: "Is" },
    { value: "is_not_empty", label: "Is set" },
    { value: "is_empty", label: "Is not set" },
  ],
  boolean: [
    { value: "equals", label: "Is" },
  ],
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function DataTableAdvancedFilters<TData>({
  fields,
  filters,
  onFiltersChange,
  open,
}: DataTableAdvancedFiltersProps<TData>) {
  const addFilter = () => {
    const firstField = fields[0]
    if (!firstField) return

    const newFilter: AdvancedFilterRule = {
      id: generateId(),
      field: firstField.id,
      operator: operatorsByType[firstField.type]?.[0]?.value ?? "contains",
      value: "",
      type: firstField.type,
    }
    onFiltersChange([...filters, newFilter])
  }

  const updateFilter = (id: string, updates: Partial<AdvancedFilterRule>) => {
    onFiltersChange(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    )
  }

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter((f) => f.id !== id))
  }

  const clearAll = () => {
    onFiltersChange([])
  }

  const handleFieldChange = (id: string, fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (!field) return

    updateFilter(id, {
      field: fieldId,
      type: field.type,
      operator: operatorsByType[field.type]?.[0]?.value ?? "contains",
      value: "",
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">
                  Advanced Filters
                </h4>
                {filters.length > 0 && (
                  <Badge variant="secondary" className="rounded-md text-xs">
                    {filters.length} active
                  </Badge>
                )}
              </div>
              {filters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Filter Rules */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filters.map((filter, index) => {
                  const field = fields.find((f) => f.id === filter.field)
                  const operators = operatorsByType[filter.type] ?? []
                  const needsValue = !["is_empty", "is_not_empty"].includes(
                    filter.operator
                  )

                  return (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      {/* Where / And */}
                      <span className="w-14 text-xs text-muted-foreground text-right shrink-0">
                        {index === 0 ? "Where" : "And"}
                      </span>

                      {/* Field Select */}
                      <select
                        value={filter.field}
                        onChange={(e) =>
                          handleFieldChange(filter.id, e.target.value)
                        }
                        className="h-8 w-[140px] rounded-md border border-border/50 bg-background px-2 text-sm
                          outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10
                          transition-colors cursor-pointer"
                      >
                        {fields.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>

                      {/* Operator Select */}
                      <select
                        value={filter.operator}
                        onChange={(e) =>
                          updateFilter(filter.id, {
                            operator: e.target.value as FilterOperator,
                          })
                        }
                        className="h-8 w-[140px] rounded-md border border-border/50 bg-background px-2 text-sm
                          outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10
                          transition-colors cursor-pointer"
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>

                      {/* Value Input */}
                      {needsValue && (
                        <>
                          {field?.type === "select" && field.options ? (
                            <select
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  value: e.target.value,
                                })
                              }
                              className="h-8 flex-1 min-w-[120px] rounded-md border border-border/50 bg-background px-2 text-sm
                                outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10
                                transition-colors cursor-pointer"
                            >
                              <option value="">Select...</option>
                              {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={
                                filter.type === "number"
                                  ? "number"
                                  : filter.type === "date"
                                  ? "date"
                                  : "text"
                              }
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  value: e.target.value,
                                })
                              }
                              placeholder="Enter value..."
                              className="h-8 flex-1 min-w-[120px] bg-background shadow-none"
                            />
                          )}
                        </>
                      )}

                      {/* Remove */}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeFilter(filter.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Add Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={addFilter}
              className="h-7 text-xs border-dashed"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add filter
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
