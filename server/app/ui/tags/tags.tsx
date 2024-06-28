import { tagRepository } from '@/app/lib/repository/tag';
import { Tag } from '@/app/lib/model/tag';

export default async function Tags() {
  const tags: Tag[] = await tagRepository.getTags();
  return (
    <table>
      <tr>
        <th>Name</th>
      </tr>
      {tags.map((tag) => {
        return (
          <tr key={tag.PK + tag.SK}>
            <td>{tag.Name}</td>
          </tr>
        );
      })}
    </table>
  );
}
