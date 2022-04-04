import { Theme, TweetProps } from "@/types";
import {
  Box,
  Grid,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  Stack,
  ThemeTypings,
} from "@chakra-ui/react";
import { FC, Fragment } from "react";

interface Tweet {
  tweet: TweetProps;
  theme: Theme;
}

type TweetTheme = {
  bg: ThemeTypings["colors"];
  accent: ThemeTypings["colors"];
  secondary: ThemeTypings["colors"];
};

const color = (theme: Theme): TweetTheme => {
  switch (theme) {
    case "light":
      return {
        bg: "white",
        accent: "#101419",
        secondary: "#576370",
      };
    case "darkBlue":
      return {
        bg: "#1c2732",
        accent: "#D9D9D9",
        secondary: "#70757C",
      };
    case "dark":
      return {
        bg: "#070807",
        accent: "#D9D9D9",
        secondary: "#70757C",
      };
  }
};

export const Tweet: FC<Tweet> = ({ theme, tweet }) => {
  const { accent, bg, secondary } = color(theme);

  const formattedText = tweet.text.replace(/https:\/\/[\n\S]+/g, "");

  return (
    <Box bgColor={bg}>
      <Stack p={8} spacing={4} w="100%">
        <HStack>
          <Img src={tweet.avatarUrl} borderRadius="full" boxSize="12" />
          <Box>
            <Heading
              lineHeight="shorter"
              fontWeight="bold"
              fontSize="xl"
              textColor={accent}
            >
              {tweet.authorName}
            </Heading>
            <Heading
              lineHeight="shorter"
              fontSize="md"
              fontWeight="normal"
              textColor={secondary}
            >
              @{tweet.authorHandle}
            </Heading>
          </Box>
        </HStack>
        <Heading fontSize="xl" fontWeight="medium" textColor={accent}>
          {formattedText.split("\n").map((line, i) => (
            <Fragment key={i}>
              {line}
              <br />
            </Fragment>
          ))}
        </Heading>
        {tweet.media && tweet.media.length ? (
          <SimpleGrid
            // d="inline-grid"
            columns={tweet.media.length === 1 ? 1 : 2}
            columnGap={2}
            my={2}
          >
            {tweet.media?.map((media, i) => (
              <Img key={i} src={media?.url} />
            ))}
          </SimpleGrid>
        ) : null}
      </Stack>
    </Box>
  );
};
