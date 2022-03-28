import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './homeposts.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface HomePostsProps {
  posts: Post[];
}

export default function HomePosts({ posts }: HomePostsProps) {
  return (
    <main>
      {posts.map(post => {
        const {
          uid,
          first_publication_date,
          data: { author, title, subtitle },
        } = post;
        return (
          <article className={styles.article} key={uid}>
            <Link href={`/posts/${uid}`} key={uid}>
              <a>
                <div>
                  <h2 className={commonStyles.title}>{title}</h2>
                  <p className={commonStyles.subtitle}>{subtitle}</p>
                </div>
                <div className={commonStyles.info}>
                  <div>
                    <FiCalendar color="#BBBBBB" />
                    <span>{first_publication_date}</span>
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
