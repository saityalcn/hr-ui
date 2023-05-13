import {React, useEffect, useState, useCallback} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Form,
    Loader,
    Message,
    TextArea
} from 'semantic-ui-react';
import MainLayout from '../layouts/layout';
import { useRouter } from 'next/router';
import {addWorker, assignWorkerToPosition} from '../../services/employeeService'
import {getPositions} from '../../services/positionService'


let selectedPositionId;
let request = false;

export default () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
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
    if(!request){
      addWorker(jsonObject).then(res => {
        console.log(res);
        assignWorkerToPosition(res.data.id).then(res => {
          if(res.data.message === "Worker is not added to project"){
            setLoading(false);
            setShowErrorMessage(true)
          }
          
          else
            router.push('/employee/employees');
          
          console.log(res)
        });
      }).catch(err => {
        setLoading(false)
        console.log(err)}
    )}}, []);
    
  if(!positions)
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
      <Message
      error
      hidden={!showErrorMessage}>Çalışanın ünvanına uygun bir proje bulunamadığı için çalışana proje atanamadı.</Message>
      <Form onSubmit={sendAddEmployeeRequest}>
        <Form.Group widths='equal'>
          <Form.Input fluid label='İsim' placeholder='Çalışan İsmi Giriniz' name="firstName"/>
          <Form.Input fluid label='Soyisim' placeholder='Çalışan Soyismi Giriniz' name="lastName"/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Kimlik Numarası' type="number" placeholder='Çalışan Kimlik Numarası Giriniz' name="ssn"/>
          <Form.Input fluid label='Telefon Numarası' type="number" placeholder='Çalışan Telefon Numarası Giriniz' name="telno"/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Maaş' type="number" placeholder='Çalışan Maaşını Giriniz' name="salary"/>
          <Form.Input fluid label='İşe Başlama Tarihi' type="date" placeholder='' name="recruitmentDate"/>
        </Form.Group>
        <Form.Select label="Ünvan" placeholder='Ünvan Seçiniz' options={positions.map(element => {return { key: element.id, value: element.name, text: element.name }})} onChange={(e,data) => {selectedPositionId = (data.options.find(element => (element.value === data.value)).key);}} ></Form.Select>
        <TextArea placeholder='Çalışan Adresi' style={{marginTop: 10 + "px", marginBottom: 10 + "px"}} name="address"/>
        <Form.Button type='submit' primary>Ekle</Form.Button>
      </Form>
      </MainLayout>
    </div>
  );
};
