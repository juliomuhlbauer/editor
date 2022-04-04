import { Tweet } from "@/components/tweet";
import { getTweets } from "@/lib/twitter";
import { TweetProps } from "@/types";
import { Box, Container } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { FC } from "react";

const Gallery: FC<{ tweets: TweetProps[] }> = ({ tweets }) => {
  console.log(tweets);

  return (
    <Container>
      {tweets.map((tweet, index) => (
        <Box key={index}>
          <Tweet tweet={tweet} theme="darkBlue" />
        </Box>
      ))}
    </Container>
  );
};

export default Gallery;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await getTweets([
    "1509856247478206470",
    "1189444653059174401",
    "935857414435495937",
    "1334528781139259400",
    "1334334544598740994",
    "826528907381739520",
    "1308509070140162048",
    "1385236589547331589",
    "1402689156434776069",
    "997895977179721728",
    "1341090253864542208",
    "1383873047619276812",
    "1435677021590351873",
    "1026872652290379776",
    "1346113149112619016",
    "1340107217970683906",
    "992629481578745856",
    "989142253468708864",
    "807626710350839808",
    "1341962177272537089",
    "1342869937841266688",
    "1116362674319908864",
    "1471558914579722245",
    "1331380003716681728",
    "1002104154737684480",
  ]);

  const tweets: TweetProps[] = data.map((tweet) => ({
    authorHandle: tweet.author?.username || "",
    avatarUrl: tweet.author?.profile_image_url || "",
    authorName: tweet.author?.name || "",
    text: tweet.text,
    media: tweet.media,
  }));

  return {
    props: {
      tweets,
    },
  };
};
