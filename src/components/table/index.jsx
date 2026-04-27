import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, SearchIcon, ChevronDown, Dot } from "lucide-react";
import { Button } from "../ui/button";
import Pagination from "../pagination";
import { cn } from "@/lib/utils";
import { Text } from "../ui/typography";
import DeleteDialog from "../dialog/delete-dialog";
import { useNavigate } from "react-router-dom";
import ThreeDotMenu from "../dropdown/three-dot-menu";

function defaultGetRowId(row, idx) {
  if (row.id !== undefined) return row.id;

  return idx;
}

export default function DataTable({
  data,
  columns,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  getRowId = defaultGetRowId,
  emptyState,
  isShowCheckbox = false,
  isShowActions = false,
  className = "",
  isLoading = false,
  page,
  setPage,
  pageSize,
  setPageSize,
  rowActions,
  toolbar,
  searchPlaceholder = "Search...",
  searchValue: controlledSearchValue,
  onSearchChange,
  isSearchable = true,
  isServerSearch = false,
  renderExpandedContent,
  getIsRowExpandable,
  getExpandedRowLabel,
  expandedRowHeader,
}) {
  const [internalQuery, setInternalQuery] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const query = controlledSearchValue ?? internalQuery;
  const currentPage = page ?? internalPage;
  const currentPageSize = pageSize ?? internalPageSize;
  const updatePage = setPage ?? setInternalPage;
  const updatePageSize = setPageSize ?? setInternalPageSize;
  const skeletonRows = Array.from({ length: currentPageSize }, (_, idx) => idx);
  const tableColumnCount =
    columns.length +
    (isShowCheckbox ? 1 : 0) +
    (renderExpandedContent ? 1 : 0) +
    (isShowActions ? 1 : 0);

  // If parent controls selection, derive from prop
  const selection = controlledSelectedIds ?? selected;
  const setSelection = (s) => {
    if (onSelectionChange) onSelectionChange(s);
    if (!controlledSelectedIds) setSelected(new Set(s));
  };

  // Filtering
  const filtered = useMemo(() => {
    if (isServerSearch) return data;
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) => {
      for (const col of columns) {
        const raw = col.searchAccessor
          ? col.searchAccessor(row)
          : col.accessor
            ? col.accessor(row)
            : row[col.key];
        if (raw === null || raw === undefined) continue;
        const s = String(raw).toLowerCase();
        if (s.includes(q)) return true;
      }
      return false;
    });
  }, [data, query, columns, isServerSearch]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const key = sortKey;
    const sortedColumn = columns.find((col) => col.key === key);
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = sortedColumn?.accessor
        ? sortedColumn.accessor(a)
        : (a[key] ?? "");
      const vb = sortedColumn?.accessor
        ? sortedColumn.accessor(b)
        : (b[key] ?? "");

      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [columns, filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / currentPageSize));
  const current = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return sorted.slice(start, start + currentPageSize);
  }, [sorted, currentPage, currentPageSize]);

  // Selection helpers
  const toggleRow = (rowId) => {
    const next = new Set(selection);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    setSelection(next);
  };

  const toggleAllOnPage = () => {
    const ids = current.map((r) => getRowId(r));
    const next = new Set(selection);
    const allOnPageSelected = ids.every((id) => next.has(id));
    if (allOnPageSelected) {
      ids.forEach((id) => next.delete(id));
    } else {
      ids.forEach((id) => next.add(id));
    }
    setSelection(next);
  };

  const toggleExpandedRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  // UI handlers
  const onSort = (col) => {
    if (!col.sortable) return;
    const key = col.key;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    updatePage(1);
  };

  const navigate = useNavigate();

  const handleSearchChange = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    }

    if (controlledSearchValue === undefined) {
      setInternalQuery(value);
    }

    updatePage(1);
  };

  const getDefaultRowActions = (rowId) => [
    {
      label: "View",
      onSelect: () => console.log("Action: view", rowId),
    },
    {
      label: "Edit",
      onSelect: () => navigate(`/products/update/${rowId}`),
    },
    {
      label: "Delete",
      onSelect: () => setIsDeleteDialogOpen(true),
      destructive: true,
    },
  ];

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {isSearchable ? (
          <div className="relative max-w-[340px] w-full flex-1">
            <SearchIcon
              size={16}
              className="absolute top-[11px] left-2.5 text-gray-400"
            />
            <input
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="py-2 pl-8 pr-4 rounded-md text-sm w-full bg-gray-50 border border-primary/20 focus:border-primary focus:outline-none tr"
            />
          </div>
        ) : (
          <div />
        )}

        {toolbar ? <div className="flex flex-wrap gap-2">{toolbar}</div> : null}
      </div>

      {/* resulst + overview */}
      <div>
        <Text variant="sm">
          Showing <b>{total}</b> results
        </Text>
        {/* <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setSortKey(null);
              setSortDir("asc");
              setPage(1);
              setSelection(new Set());
            }}
          >
            Reset
          </Button>
        </div> */}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 !bg-white">
        <div className="custom-horizontal-scrollbar overflow-x-auto overflow-y-hidden">
          <Table>
            <TableHeader>
              <TableRow className="!bg-primary/10 !text-primary">
                {isShowCheckbox && (
                  <TableHead className="w-12 px-4">
                    <div className="flex items-center">
                      <Checkbox
                        aria-label="Select all"
                        checked={
                          current.length > 0 &&
                          current.every((r) => selection.has(getRowId(r)))
                        }
                        onCheckedChange={toggleAllOnPage}
                      />
                    </div>
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    className={`px-4 ${col.width ? String(col.width) : ""}`}
                  >
                    <button
                      className="flex items-center gap-2 w-full text-left"
                      onClick={() => onSort(col)}
                    >
                      <span>{col.header}</span>
                      {col.sortable ? (
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      ) : null}
                    </button>
                  </TableHead>
                ))}

                {renderExpandedContent ? (
                  <TableHead className="px-4 text-right">
                    {expandedRowHeader ?? ""}
                  </TableHead>
                ) : null}

                {isShowActions ? (
                  <TableHead className="w-12 px-4">Actions</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                skeletonRows.map((rowIdx) => (
                  <TableRow key={`skeleton-row-${rowIdx}`}>
                    {isShowCheckbox && (
                      <TableCell className="w-12 px-4">
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell
                        key={`skeleton-cell-${rowIdx}-${String(col.key)}`}
                        className={`py-4 px-4 ${
                          col.width ? String(col.width) : ""
                        }`}
                      >
                        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      </TableCell>
                    ))}

                    {renderExpandedContent ? (
                      <TableCell className="px-4 text-right">
                        <div className="ml-auto h-8 w-24 animate-pulse rounded-md bg-gray-200" />
                      </TableCell>
                    ) : null}

                    {isShowActions ? (
                      <TableCell className="w-12 px-4 text-center">
                        <div className="ml-auto h-8 w-8 animate-pulse rounded-md bg-gray-200" />
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              ) : current.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumnCount}>
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      {emptyState ?? "No results."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                current.map((row) => {
                  const rowId = getRowId(row);
                  const isExpandable = renderExpandedContent
                    ? (getIsRowExpandable?.(row) ?? true)
                    : false;
                  const isExpanded = expandedRows.has(rowId);
                  return (
                    <React.Fragment key={String(rowId)}>
                      <TableRow className="hover:bg-muted/50">
                        {isShowCheckbox && (
                          <TableCell className="w-12 px-4">
                            <Checkbox
                              checked={selection.has(rowId)}
                              onCheckedChange={() => toggleRow(rowId)}
                              aria-label={`Select row ${String(rowId)}`}
                            />
                          </TableCell>
                        )}

                        {columns.map((col) => (
                          <TableCell
                            key={String(col.key)}
                            className={`py-4 opacity-75 px-4 ${
                              col.width ? String(col.width) : ""
                            }`}
                          >
                            {col.render
                              ? col.render(row)
                              : col.accessor
                                ? col.accessor(row)
                                : row[col.key]}
                          </TableCell>
                        ))}

                        {renderExpandedContent ? (
                          <TableCell className="px-4 text-right">
                            {isExpandable ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto gap-1.5 text-slate-600"
                                onClick={() => toggleExpandedRow(rowId)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 rotate-180" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                {getExpandedRowLabel?.(row, isExpanded) ??
                                  (isExpanded ? "Hide details" : "See details")}
                              </Button>
                            ) : null}
                          </TableCell>
                        ) : null}

                        {isShowActions ? (
                          <TableCell className="w-12 px-4 text-center">
                            <ThreeDotMenu
                              actions={
                                typeof rowActions === "function"
                                  ? rowActions(row)
                                  : (rowActions ?? getDefaultRowActions(rowId))
                              }
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>

                      {isExpandable && isExpanded ? (
                        <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                          <TableCell colSpan={tableColumnCount} className="px-6 py-4">
                            {renderExpandedContent(row)}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {total > currentPageSize && (
        <div className="flex items-center justify-between">
          <div className="flx gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="pr-2 pl-3">
                    <div className="flx gap-2">
                      <span>{currentPageSize}</span>
                      <ChevronDown />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pageSizeOptions.map((n) => (
                    <DropdownMenuItem
                      key={n}
                      onSelect={() => {
                        updatePageSize(n);
                        updatePage(1);
                      }}
                    >
                      {n}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Dot className="text-gray-500" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div>
                Page {currentPage} of {pageCount}
              </div>
            </div>
          </div>
          <Pagination
            totalItems={total}
            currentPage={currentPage}
            pageSize={currentPageSize}
            onPageChange={(p) => updatePage(p)}
          />

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
          />
        </div>
      )}
    </div>
  );
}
