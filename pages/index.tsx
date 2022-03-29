import {
  Box,
  Button,
  Container,
  filter,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { toPng } from "html-to-image";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import produce from "immer";

type Filter = {
  cssName: string;
  value: number;
  unity: string;
  range?: [number, number];
};

const initialFilters: Filter[] = [
  {
    cssName: "blur",
    value: 0,
    unity: "px",
    range: [0, 10],
  },
  {
    cssName: "brightness",
    value: 100,
    unity: "%",
    range: [0, 200],
  },
  {
    cssName: "contrast",
    value: 100,
    unity: "%",
    range: [0, 200],
  },
  // // "drop-shadow": {
  // //   value: 0,
  // //   unity: "px"
  // // },
  {
    cssName: "grayscale",
    value: 0,
    unity: "%",
    range: [0, 100],
  },
  // // "hue-rotate": {
  // //   value: 0,
  // //   unity: "px"
  // // },
  {
    cssName: "invert",
    value: 0,
    unity: "%",
  },
  {
    cssName: "opacity",
    value: 100,
    unity: "%",
  },
  {
    cssName: "saturate",
    value: 100,
    unity: "%",
    range: [0, 200],
  },
  {
    cssName: "sepia",
    value: 0,
    unity: "%",
    range: [0, 100],
  },
  // // url:
  // // initial
  // // inherit
];

const Editor = () => {
  const [filters, setFilters] = useState<Filter[]>(initialFilters);

  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <Container maxW="container.lg" py={8}>
      <HStack align="center" spacing={8}>
        <Box
          filter={filters
            .map(({ cssName, value, unity }) => `${cssName}(${value}${unity})`)
            .join(" ")}
          ref={ref}
          boxSize={64}
          bgColor="red.500"
        />
        <Stack spacing={4} align="center" w="50%">
          {filters.map((filter, index) => (
            <FilterSlider
              filter={filter}
              index={index}
              setFilters={setFilters}
              key={index}
            />
          ))}
          <HStack>
            <Button onClick={() => setFilters(initialFilters)}>Reset</Button>
            <Button onClick={onButtonClick}>Export</Button>
          </HStack>
        </Stack>
      </HStack>
    </Container>
  );
};

export default Editor;

interface FilterSliderProps {
  filter: Filter;
  index: number;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}

const FilterSlider: FC<FilterSliderProps> = ({ filter, index, setFilters }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Stack w="full" align="start">
      <Heading>{filter.cssName}</Heading>
      <Slider
        value={filter.value}
        onChange={(value) =>
          setFilters(
            produce((draft) => {
              draft[index].value = value;
            })
          )
        }
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        min={filter.range?.[0] ?? 0}
        max={filter.range?.[1] ?? 100}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          placement="top"
          isOpen={showTooltip}
          label={`${filter.value}${filter.unity}`}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Stack>
  );
};
