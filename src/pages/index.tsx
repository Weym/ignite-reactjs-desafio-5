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
  const [nextPage, setNextPage] = useState(next_page);
  const [posts, setPosts] = useState<Post[]>(formatPostsDate(results));

  async function handleNextPage(): Promise<void> {
    const response = await fetch(nextPage);
    const responseData = await response.json();

    const nextPagePosts = mapResponseFromPrismic(responseData);
    const formatedNextPagePosts = formatPostsDate(nextPagePosts);

    setPosts([...posts, ...formatedNextPagePosts]);
    setNextPage(responseData.next_page);
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
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content', 'post.author', 'post.subtitle'],
      pageSize: 2,
    }
  );

  const posts = mapResponseFromPrismic(response);

  return {
    props: {
      postsPagination: { results: posts, next_page: response.next_page },
    },
  };
};

function mapResponseFromPrismic(response) {
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
    const formatedDate = format(
      new Date(post.first_publication_date),
      'd MMM yyyy',
      {
        locale: ptBR,
      }
    );
    return { ...post, first_publication_date: formatedDate };
  });
}
