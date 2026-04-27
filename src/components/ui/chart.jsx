import React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const ChartContext = React.createContext(null);

const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("Chart components must be used within <ChartContainer />");
  }

  return context;
};

const ChartContainer = ({ id, className, children, config }) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-slate-500 [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-slate-200 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-slate-200 [&_.recharts-radial-bar-background-sector]:fill-slate-100 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-slate-100 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-slate-200 flex aspect-video justify-center text-xs",
          className,
        )}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
};

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config || {}).filter(
    ([, item]) => item.theme || item.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.light || item.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
        `,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      labelFormatter,
      formatter,
      hideLabel = false,
    },
    ref,
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const uniquePayload = payload.filter(
      (item, index, items) =>
        items.findIndex((entry) => entry.dataKey === item.dataKey) === index,
    );

    const tooltipLabel =
      uniquePayload[0]?.payload?.label ?? uniquePayload[0]?.name;

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-[180px] rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur",
          className,
        )}
      >
        {!hideLabel ? (
          <div className="mb-2 text-xs font-medium text-slate-500">
            {labelFormatter
              ? labelFormatter(tooltipLabel, uniquePayload)
              : tooltipLabel}
          </div>
        ) : null}

        <div className="space-y-2">
          {uniquePayload.map((item) => {
            const key = item.dataKey;
            const itemConfig = config?.[key] ?? {};
            const indicatorColor = item.color || itemConfig.color;

            return (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: indicatorColor }}
                  />
                  <span className="text-sm text-slate-600">
                    {itemConfig.label ?? item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-950">
                  {formatter
                    ? formatter(item.value, item.name, item, uniquePayload)
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent };
