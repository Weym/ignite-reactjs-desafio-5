import { GetStaticProps } from 'next';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';

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

export default function Home({ posts }) {
  return (
    <div className={`${commonStyles.container} ${styles.homeContainer}`}>
      <div>
        <Header />
      </div>

      <main>
        {posts.map(post => {
          const {
            slug,
            first_publication_date,
            data: { author, title, subtitle },
          } = post;
          console.log(author, title);
          return (
            <article className={styles.article}>
              <Link href={`/posts/${slug}`} key={slug}>
                <a>
                  <div>
                    <h2 className={commonStyles.title}>{title}</h2>
                    <p className={commonStyles.subtitle}>{subtitle}</p>
                  </div>
                  <div className={commonStyles.info}>
                    <div>
                      <FiCalendar color="#BBBBBB" />
                      <span>
                        {format(
                          new Date(first_publication_date),
                          'd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </span>
                    </div>
                    <div>
                      <FiUser color="#BBBBBB" />
                      <span>{author}</span>
                    </div>
                  </div>
                </a>
              </Link>
            </article>
          );
        })}

        <div className={styles.loadMore}>
          <button>Carregar mais posts</button>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ]);

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    };
  });
  console.log(new Date());

  return { props: { posts } };
};
