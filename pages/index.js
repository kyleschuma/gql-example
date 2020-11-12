import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';

function useSkiResortsQuery(query) {
  return useQuery(
    gql`
      query SkiResortsQuery($query: String) {
        list: listSkiResorts(query: $query) {
          key
          name
        }
      }
    `,
    {
      variables: { query },
    }
  );
}

export default function Index() {
  const { loading, error, data, refetch } = useSkiResortsQuery();

  const hangleQueryChange = e => {
    const query = e.target.value;
    refetch({ query });
  };

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error...</p>;

  return (
    <>
      <header>
        <input placeholder="Filter resorts..." onChange={hangleQueryChange} />
      </header>
      <ul>
        {data.list.map(item => (
          <li kye={item.key}>
            <Link href={`/${encodeURIComponent(item.key)}`}>
              <a>{item.name}</a>
            </Link>
          </li>
        ))}
        {data.list.length === 0 && <li>No resorts found.</li>}
      </ul>
      <style jsx>{`
        header {
          margin-top: 1rem;
        }
        input {
          font-size: 1.25rem;
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #555;
        }
        input:focus {
          border: 1px solid #fff;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        ul > li {
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}
