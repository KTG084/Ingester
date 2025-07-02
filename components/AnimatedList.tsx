import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
} from "react";
import { motion, useInView } from "framer-motion";
import { GeneratedAvatar } from "./generatedAvatar";
import { Video } from "lucide-react";

// Define the item type
type Item = {
  label: string;
  value: string;
  instructions: string;
  meetings: number;
};

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: Item[];
  onItemSelect?: (item: Item, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    {
      label: "Agent Alpha",
      value: "agent-alpha",
      instructions: "This is Agent Alpha.",
      meetings: 2,
    },
    {
      label: "Agent Beta",
      value: "agent-beta",
      instructions: "Agent Beta's instructions go here.",
      meetings: 0,
    },
    {
      label: "Agent Gamma",
      value: "agent-gamma",
      instructions: "Instructions for Gamma agent.",
      meetings: 5,
    },
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-[400px] ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[350px] overflow-y-auto p-4 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#222 #060010",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={item.value}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div
              className={`relative p-4 rounded-xl border border-cyan-400/10 backdrop-blur-lg 
                bg-gradient-to-br from-[#0a0a1a]/80 via-[#0f1b2e]/90 to-[#07172f]/90 
                shadow-[0_8px_24px_rgba(0,255,255,0.05)] hover:shadow-[0_12px_30px_rgba(34,211,238,0.15)] 
                transition-all duration-300 ease-in-out transform hover:scale-[1.02] group
                ${
                  selectedIndex === index
                    ? "ring-[1.5px] ring-cyan-300/50 bg-cyan-300/5 shadow-cyan-300/20"
                    : ""
                } ${itemClassName}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <GeneratedAvatar
                    seed={item.label}
                    className="w-8 h-8 rounded-full border border-cyan-500/30 shadow-sm"
                    variant="botttsNeutral"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-cyan-300 drop-shadow-[0_1px_4px_#22d3ee] leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-sm text-white/80 mt-1 leading-snug">
                    {item.instructions}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h3
                    className="
                      text-sm font-semibold flex items-center gap-1.5
                      bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                      border border-cyan-400/30 
                      rounded-xl 
                      px-3 py-1.5
                      text-cyan-300 
                      shadow-lg shadow-cyan-500/25
                      backdrop-blur-sm
                      hover:shadow-cyan-500/40 hover:border-cyan-400/50
                      transition-all duration-300
                      leading-tight
                    "
                  >
                    {(item.meetings ?? 0) === 1 ? "1 " : `${item.meetings ?? 0}`}
                    <Video className="w-4 h-4" />
                  </h3>
                </div>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0a0a1a]/30 to-transparent pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07172f]/30 to-transparent pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
