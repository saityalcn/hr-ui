import {React, useEffect, useState, useCallback} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Form,
    Loader,
    TextArea
} from 'semantic-ui-react';
import MainLayout from '../layouts/layout';
import { useRouter } from 'next/router';
import {addWorker} from '../../services/employeeService'
import {getPositions} from '../../services/positionService'


let selectedPositionId;

export default () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState(null);
  const router = useRouter();

  const sendAddEmployeeRequest = useCallback(async (event) => {
    setLoading(true)
    const jsonObject = {
      name: event.target.firstName.value,
      surname: event.target.lastName.value,
      ssn: event.target.ssn.value,
      address: event.target.address.value,
      telNo: event.target.telno.value,
      salary: event.target.salary.value,
      positionId: selectedPositionId,
      recruitmentDate: event.target.recruitmentDate.value,
      termiantionDate: new Date(),
    }   
    console.log(jsonObject)
    addWorker(jsonObject).then(res => {
      router.push('/employee/employees');
    }).catch(err => {
      setLoading(false)
      console.log(err)}
  )}, []);

  getPositions().then(res => setPositions(res.data)).catch(err => console.log(err));
      
  if(loading || positions == null)
        return (<Loader active/>)
    
  return (
    <div>
      <link
        rel="stylesheet"
        type="text/css"
        href="semantic/dist/semantic.min.css"
      ></link>
      <MainLayout>
      <Form onSubmit={sendAddEmployeeRequest}>
        <Form.Group widths='equal'>
          <Form.Input fluid label='İsim' placeholder='Çalışan İsmi Giriniz' name="firstName"/>
          <Form.Input fluid label='Soyisim' placeholder='Çalışan Soyismi Giriniz' name="lastName"/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Kimlik Numarası' placeholder='Çalışan Kimlik Numarası Giriniz' name="ssn"/>
          <Form.Input fluid label='Telefon Numarası' placeholder='Çalışan Telefon Numarası Giriniz' name="telno"/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Maaş' placeholder='Çalışan Maaşını Giriniz' name="salary"/>
          <Form.Input fluid label='İşe Başlama Tarihi' type="date" placeholder='' name="recruitmentDate"/>
        </Form.Group>
        <Form.Select label="Ünvan" placeholder='Ünvan Seçiniz' options={positions.map(element => {return { key: element.id, value: element.name, text: element.name }})} onChange={(e,data) => {selectedPositionId = (data.options.find(element => (element.value === data.value)).key);console.log(selectedPositionId);}} ></Form.Select>
        <TextArea placeholder='Çalışan Adresi' style={{marginTop: 10 + "px", marginBottom: 10 + "px"}} name="address"/>
        <Form.Button type='submit' primary>Ekle</Form.Button>
      </Form>
      </MainLayout>
    </div>
  );
};
