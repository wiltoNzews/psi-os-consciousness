import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelComparisonProps {
  models: any[];
}

export function ModelComparison({ models }: ModelComparisonProps) {
  if (!models || models.length === 0) {
    return <ModelComparisonSkeleton />;
  }

  // Sort models by input cost (lowest to highest)
  const sortedModels = [...models].sort((a, b) => 
    (a.costs?.inputPer1M || 0) - (b.costs?.inputPer1M || 0)
  );

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="hidden md:table-cell">Provider</TableHead>
              <TableHead className="hidden md:table-cell">Context Window</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span>Input Cost</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Cost per 1 million input tokens in USD
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span>Output Cost</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          Cost per 1 million output tokens in USD
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>Capabilities</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {model.provider}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {model.contextWindow?.toLocaleString() || '-'}
                </TableCell>
                <TableCell>
                  ${model.costs?.inputPer1M?.toFixed(2) || '-'}
                </TableCell>
                <TableCell>
                  ${model.costs?.outputPer1M?.toFixed(2) || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities?.map((capability: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {model.available ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                      Unavailable
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          * Cost optimization is automatically applied based on your selected profile and job requirements.
        </p>
      </div>
    </div>
  );
}

function ModelComparisonSkeleton() {
  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="hidden md:table-cell">Provider</TableHead>
            <TableHead className="hidden md:table-cell">Context Window</TableHead>
            <TableHead>Input Cost</TableHead>
            <TableHead>Output Cost</TableHead>
            <TableHead>Capabilities</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}