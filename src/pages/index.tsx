import { useState } from 'react';
import { GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';
import HomePosts from '../components/HomePosts';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatDate } from '../utils/posts';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps) {
  const [nextPage, setNextPage] = useState<string>(next_page);
  const [posts, setPosts] = useState<Post[]>(formatPostsDate(results));

  async function handleNextPage(): Promise<void> {
    const { postsResponse, nextPageResponse } = await getPostsFromPrismic(
      nextPage
    );

    setPosts([...posts, ...postsResponse]);
    setNextPage(nextPageResponse);
  }

  return (
    <div className={`${commonStyles.container} ${styles.homeContainer}`}>
      <Header />
      <HomePosts posts={posts} />

      {nextPage && (
        <div className={styles.loadMore}>
          <button onClick={handleNextPage}>Carregar mais posts</button>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('post', {
    pageSize: 2,
  });

  const posts = mapPrismicResponse(response);

  return {
    props: {
      postsPagination: { results: posts, next_page: response.next_page },
    },
  };
};

async function getPostsFromPrismic(
  nextPage: string
): Promise<{ postsResponse: Post[]; nextPageResponse: string }> {
  const response = await fetch(nextPage);
  const responseData = await response.json();

  const nextPagePosts = mapPrismicResponse(responseData);
  const formatedNextPagePosts = formatPostsDate(nextPagePosts);

  // nextPagePosts.map(post => {
  //   const formatedDate = formatDate(post.first_publication_date);
  //   return { ...post, first_publication_date: formatedDate };
  // });

  return {
    postsResponse: formatedNextPagePosts,
    nextPageResponse: responseData.next_page,
  };
}

function mapPrismicResponse(response): Post[] {
  return response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    };
  });
}

function formatPostsDate(posts: Post[]) {
  return posts.map(post => {
    const formatedDate = formatDate(post.first_publication_date);
    return { ...post, first_publication_date: formatedDate };
  });
}
