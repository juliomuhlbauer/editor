import { Tweet } from "@/components/tweet";
import { Format, Theme, TweetProps } from "@/types";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { toPng } from "html-to-image";
import produce from "immer";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";

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

const TweetEditor = () => {
  const [link, setLink] = useState("");

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

  const fetchTweet = async () => {
    const res = await fetch(`/api/tweet?id=${link.slice(-19)}`);
    const data = await res.json();
    const tweet = data[0];

    setTweet({
      authorName: tweet.author.name,
      authorHandle: tweet.author.username,
      text: tweet.text,
      avatarUrl: tweet.author.profile_image_url,
    });
  };

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
              <HStack>
                <Input value={link} onChange={(e) => setLink(e.target.value)} />
                <Button
                  onClick={() => {
                    fetchTweet();
                  }}
                >
                  Fetch
                </Button>
              </HStack>
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
