import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShowById } from '../utils/api';
import ShowDetails from '../components/ShowDetails';

export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    fetchShowById(id).then((data) => setShow(data));
  }, [id]);

  if (!show) return <div>Loading...</div>;

  return (
    <div>
      <ShowDetails show={show} />
    </div>
  );
}