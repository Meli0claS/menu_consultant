import { MenuContext } from '../contexts/MenuContext';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Home = () => {
  const { searchMenu } = useContext(MenuContext);

  const { handleSubmit, register, setValue } = useForm();

  const history = useHistory();

  const typeOptions = [
    { value: "tiết kiệm", label: "tiết kiệm" },
    { value: "bình thường", label: "bình thường" },
    { value: "cao cấp", label: "cao cấp" }
  ];

  const regionOptions = [
    { value: "châu á", label: "châu á" },
    { value: "châu âu", label: "châu âu" },
  ];

  const nutriOptions = [
    { value: "giàu đạm", label: "giàu đạm" },
    { value: "giàu canxi", label: "giàu canxi" },
    { value: "giàu chất xơ", label: "giàu chất xơ" },
    { value: "giàu mỡ", label: "giàu mỡ" }
  ]

  const sideOptions = [
    { value: "miền bắc", label: "miền bắc" },
    { value: "tăng nam", label: "miền nam" },
    { value: "miền trung", label: "miền trung" },
  ]

  const otherOptions = [
    { value: "chay", label: "chay" },
    { value: "tăng cân", label: "tăng cân" },
    { value: "giảm cân", label: "giảm cân" },
    { value: "đặc sản", label: "đặc sản" },
  ]

  const groupedOptions = [
    {
      label: "Chi phí",
      options: typeOptions
    }
    , {
      label: "Khu vực",
      options: regionOptions
    },
    {
      label: "Miền (Việt Nam)",
      options: sideOptions
    }, {
      label: "Dinh dưỡng",
      options: nutriOptions
    },
    {
      label: "Khác",
      options: otherOptions
    }
  ];

  const search = async data => {
    try {
      const searchForm = {
        days: data.days,
        selectedTags: data.selectedTags.map((tag) => tag.value)
      };
      const searchData = await searchMenu(searchForm);
      if (searchData.success) {
        history.push({ pathname: '/menus', state: searchData.menus });
      } else {
        console.log('nothing')
      }
    } catch (error) {
      console.log(error);
    }
  }

  let body = null;
  body = (
    <>
      <div className="home">
        <div className="text-center">
          <h1>Tư vấn thực đơn</h1>
        </div>
        <div className="search-form">
          <Form className="my-4" onSubmit={handleSubmit(search)}>
            <p>Số lượng ngày</p>
            <Form.Group>
              <Form.Control type='number' placeholder='Nhập số lượng ngày' name='days' required {...register("days")} />
            </Form.Group>
            <p>Chọn nhãn dán</p>
            <div className="my-4">
              <Select
                name='selectedTags'
                options={groupedOptions}
                components={animatedComponents}
                noOptionsMessage={() => 'Không tìm thấy kết quả nào'}
                isMulti
                isSearchable
                required
                onChange={(selectedOptions) => setValue('selectedTags', selectedOptions)}
              />
            </div>
            <Button variant='info' size='md' className='ml-2' type='submit'>Tư vấn</Button>
          </Form>
        </div>
      </div>
    </>
  )

  return (
    <div>{body}</div>
  )
}

export default Home