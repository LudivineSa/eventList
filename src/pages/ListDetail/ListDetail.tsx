import { List } from '../../components/List/List.tsx';
import './ListDetail.css';

export const ListDetail = () => {

  const listArray = ["Alcool fort", "Alcool faible", "Soft", "Gateau"]

  return (
    <div className="container">
      <h1>Liste anniversaire Levi & Chatte</h1>
      <div className='grid'>
        { listArray.map((item, index) => (
          <List key={index} name={item} />
        ))}
      </div>
    </div>
  )
}