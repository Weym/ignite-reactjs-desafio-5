import { GetStaticPaths, GetStaticProps } from 'next';
import { Container } from 'next/app';
import { RichText } from 'prismic-dom';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return <div>hi</div>;
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ]);

  const slugs = posts.results.map(post => post.uid);

  return {
    paths: slugs.map(slug => {
      return { params: { slug } };
    }),
    fallback: true,
  };
};

export const getStaticProps = async context => {
  const { slug } = context.params;
  console.log(slug);

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: response.data,
    title: response.data.title,
    banner: {
      url: response.data.banner?.url,
    },
    author: response.data.author,
    content: response.data.content.map(content => {
      return {
        heading: content.heading,
        body: content.body.map(body => {
          return {
            text: body.text,
          };
        }),
      };
    }),
  };

  return { props: { post } };
};
