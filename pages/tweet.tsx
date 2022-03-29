import {
  AspectRatio,
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  HStack,
  Img,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  ThemeTypings,
} from "@chakra-ui/react";
import { toPng } from "html-to-image";
import produce from "immer";
import Head from "next/head";
import { FC, Fragment, useCallback, useRef, useState } from "react";

type Theme = "light" | "darkBlue" | "dark";

type Format = "twitter" | "instagram" | "1x1";

type TweetProps = {
  authorHandle: string;
  text: string;
  avatarUrl: string;
  authorName: string;
};

interface TweetDisplayProps {
  tweet: TweetProps;
  theme: Theme;
}

const color = (
  theme: Theme
): {
  bg: ThemeTypings["colors"];
  accent: ThemeTypings["colors"];
  secondary: ThemeTypings["colors"];
} => {
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

const formatter = (format: Format) => {
  switch (format) {
    case "twitter":
      return undefined;
    case "1x1":
      return 1;
    case "instagram":
      return 4 / 5;
  }
};

const canvas = (format: Format, el: HTMLDivElement) => {
  switch (format) {
    case "twitter":
      return {
        width: el.clientWidth * 2,
        height: el.clientHeight * 2,
      };
    case "1x1":
      return {
        width: 1080,
        height: 1080,
      };
    case "instagram":
      return {
        width: 1080,
        height: 1350,
      };
  }
};

const Tweet: FC<TweetDisplayProps> = ({ theme, tweet }) => {
  const { accent, bg, secondary } = color(theme);

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
          {tweet.text.split("\n").map((line, i) => (
            <Fragment key={i}>
              {line}
              <br />
            </Fragment>
          ))}
        </Heading>
      </Stack>
    </Box>
  );
};

const TweetEditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("darkBlue");
  const [format, setFormat] = useState<Format>("twitter");
  const [tweet, setTweet] = useState<TweetProps>({
    authorName: "Júlio Werner",
    authorHandle: "julio_werner_",
    text: "O melhor dia para começar foi ontem, mas o segundo melhor é hoje.\n\nComece a criar consistência hoje para não se arrepender amanhã.",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/1481415043443044360/LG5n1vzt_400x400.jpg",
  });

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, {
      canvasHeight: canvas(format, ref.current).height,
      canvasWidth: canvas(format, ref.current).width,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "tweet.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [format, ref]);

  return (
    <>
      <Head>
        <title>Tweet Editor</title>
      </Head>
      <Container maxW="container.lg" py={8}>
        <Heading my={6}>Tweet Editor</Heading>
        <Stack direction={{ base: "column", md: "row" }} spacing={8}>
          <Stack align="center">
            <Box ref={ref}>
              {format === "twitter" ? (
                <Box minW="md">
                  <Tweet theme={theme} tweet={tweet} />
                </Box>
              ) : (
                <AspectRatio minW="md" ratio={formatter(format)}>
                  <Tweet theme={theme} tweet={tweet} />
                </AspectRatio>
              )}
            </Box>
            <Stack spacing={4} align="start" w="100%">
              <Box>
                <FormLabel>Theme</FormLabel>
                <RadioGroup
                  value={theme}
                  onChange={(value) => {
                    const newTheme = value as Theme;
                    setTheme(newTheme);
                  }}
                >
                  <Stack direction="row">
                    <Radio value="light">Light</Radio>
                    <Radio value="darkBlue">Dark Blue</Radio>
                    <Radio value="dark">Dark</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Box>
                <FormLabel>Format</FormLabel>
                <RadioGroup
                  value={format}
                  onChange={(value) => {
                    const newFormat = value as Format;
                    setFormat(newFormat);
                  }}
                >
                  <Stack direction="row">
                    <Radio value="twitter">Twitter</Radio>
                    <Radio value="1x1">1 x 1</Radio>
                    <Radio value="instagram">Instagram</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Button alignSelf="start" onClick={onButtonClick}>
                Download
              </Button>
            </Stack>
          </Stack>
          <Stack spacing={8} w="100%">
            <Heading>Tweet Options</Heading>

            <Box>
              <FormLabel>Name</FormLabel>
              <Input
                value={tweet.authorName}
                onChange={(e) =>
                  setTweet(
                    produce((draft) => {
                      draft.authorName = e.target.value;
                    })
                  )
                }
              />
            </Box>

            <Box>
              <FormLabel>Handle</FormLabel>
              <Input
                value={tweet.authorHandle}
                onChange={(e) =>
                  setTweet(
                    produce((draft) => {
                      draft.authorHandle = e.target.value;
                    })
                  )
                }
              />
            </Box>

            <Box>
              <FormLabel>Avatar</FormLabel>
              <Input
                value={tweet.avatarUrl}
                onChange={(e) =>
                  setTweet(
                    produce((draft) => {
                      draft.avatarUrl = e.target.value;
                    })
                  )
                }
              />
            </Box>

            <Box>
              <FormLabel>Tweet</FormLabel>

              <Textarea
                minH={32}
                value={tweet.text}
                onChange={(e) =>
                  setTweet(
                    produce((draft) => {
                      draft.text = e.target.value;
                    })
                  )
                }
              />
            </Box>

            <Box>
              <FormLabel>Font</FormLabel>
              <Select>
                <option value="inter">Inter</option>
              </Select>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default TweetEditor;