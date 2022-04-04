import { Tweet } from "@/components/tweet";
import { TweetProps } from "@/types";
import { Box, Button, Container, HStack, Input } from "@chakra-ui/react";
import { FC, useState } from "react";

const Thread: FC<{ tweets: TweetProps[] }> = () => {
  const [thread, setThread] = useState([]);
  const [link, setLink] = useState("");

  const fetchTweet = async () => {
    const res = await fetch(`/api/thread?id=${link.slice(-19)}`);
    const data = await res.json();

    const thread = data.tweets.map((tweet) => ({
      authorHandle: data.author?.username || "",
      avatarUrl: data.author?.profile_image_url || "",
      authorName: data.author?.name || "",
      ...tweet,
    }));

    setThread(thread);
  };

  return (
    <Container>
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
      {thread.map((tweet, index) => (
        <Box key={index}>
          <Tweet tweet={tweet} theme="darkBlue" />
        </Box>
      ))}
    </Container>
  );
};

export default Thread;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const data = await getThread("1509856247478206470");

//   const thread = data.tweets.map((tweet) => ({
//     authorHandle: data.author?.username || "",
//     avatarUrl: data.author?.profile_image_url || "",
//     authorName: data.author?.name || "",
//     ...tweet,
//   }));

//   return {
//     props: {
//       thread,
//     },
//   };
// };
