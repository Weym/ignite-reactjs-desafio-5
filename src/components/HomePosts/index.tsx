import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './homeposts.module.scss';

interface Posts {
  slug: string;
  first_publication_date: string;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface HomePostsProps {
  posts: Posts[];
}

export default function HomePosts({ posts }: HomePostsProps) {
  return (
    <main>
      {posts.map(post => {
        const {
          slug,
          first_publication_date,
          data: { author, title, subtitle },
        } = post;
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
                      {format(new Date(first_publication_date), 'd MMM yyyy', {
                        locale: ptBR,
                      })}
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
    </main>
  );
}
