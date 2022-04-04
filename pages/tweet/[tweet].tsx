import { Tweet } from "@/components/tweet";
import { getTweet } from "@/lib/twitter";
import { TweetProps } from "@/types";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Stack,
} from "@chakra-ui/react";
import { toPng } from "html-to-image";
import { GetServerSideProps } from "next";
import { FC, useCallback, useRef } from "react";

const TweetGenerator: FC<{ tweet: TweetProps }> = ({ tweet }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, {
      canvasHeight: ref.current.clientHeight * 2,
      canvasWidth: ref.current.clientWidth * 2,
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
  }, [ref]);

  return (
    <Center minH="100vh">
      <Container>
        <Stack spacing={8} align="center">
          <Box ref={ref}>
            <Tweet theme="darkBlue" tweet={tweet} />
          </Box>
          <Button onClick={onButtonClick}>Download</Button>
        </Stack>
      </Container>
    </Center>
  );
};

export default TweetGenerator;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const data = await getTweet("1508213556474482702");

  const tweet: TweetProps = {
    authorHandle: data.author?.username || "",
    avatarUrl: data.author?.profile_image_url || "",
    authorName: data.author?.name || "",
    text: data.text,
    media: [],
  };

  return {
    props: {
      tweet,
    },
  };
};
