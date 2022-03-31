import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Container } from 'next/app';
import { RichText } from 'prismic-dom';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { formatDate } from '../../utils/posts';

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
  const router = useRouter();
  const estimatedReadingTime = post.data.content.reduce(
    (sumTotalTime, content) => {
      const numberOfWords = RichText.asText(content.body).split(/\S+/g).length;
      return Math.ceil(sumTotalTime + numberOfWords / 200);
    },
    0
  );

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }

  return (
    <>
      <div className={commonStyles.container}>
        <Header title={post.data.title} />
      </div>
      <article>
        {post.data.banner.url && (
          <div className={styles.banner}>
            <img
              className={styles.banner}
              height="400"
              src={post.data.banner.url}
              alt={post.data.title}
            />
          </div>
        )}
        <div className={`${styles.postContainer} ${commonStyles.container}`}>
          <h1 className={styles.postTitle}>{post.data.title}</h1>

          <div className={commonStyles.info}>
            <div>
              <FiCalendar color="#BBBBBB" />
              <span>{formatDate(post.first_publication_date)}</span>
            </div>
            <div>
              <FiUser color="#BBBBBB" />
              <span>{post.data.author}</span>
            </div>
            <div>
              <FiCalendar color="#BBBBBB" />
              <span>{estimatedReadingTime} min</span>
            </div>
          </div>
          {post.data.content.map(content => {
            return (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.postBody}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            );
          })}

          <div className={styles.info}></div>
          <div className={styles.content}></div>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
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

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: response.data,
  };

  return { props: { post } };
};
