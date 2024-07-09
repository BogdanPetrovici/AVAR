import styles from '@/app/ui/css/responsive-table.module.scss';

import { tagRepository } from '@/app/lib/repository/tag.repository';
import { StartingKeyNotFoundError } from '@/app/lib/errors/starting-key-not-found.error';
import { TagList } from '@/app/lib/view-model/tag-list.viewmodel';

import Pagination from '@/app/ui/components/pagination';

import Link from 'next/link';

export default async function Tags({ page }: { page?: string }) {
  let tagData: TagList;
  try {
    tagData = await tagRepository.getTags(15, page);
  } catch (error) {
    if (error instanceof StartingKeyNotFoundError) {
      tagData = await tagRepository.getTags(15);
    } else {
      throw error;
    }
  }

  const nextPage = tagData.LastKey;

  return (
    <>
      <div className={styles.tableContainer}>
        <table
          className={styles.responsiveTable}
          aria-label="tags table"
          data-test="tagsTable"
        >
          <tbody>
            {tagData.Tags.map((tag) => {
              return (
                <tr key={tag.PK + tag.SK}>
                  <td>
                    <Link className={styles.rowLink} href="#">
                      {tag.Name}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination nextPage={nextPage} />
      </div>
    </>
  );
}
