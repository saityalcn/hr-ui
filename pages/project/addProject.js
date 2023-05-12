import { React, useCallback, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Button,
  Form,
  Icon,
  Loader
} from 'semantic-ui-react';
import Layout from '../layouts/layout';
import {addProject} from '../../services/projectService'
import { useRouter } from 'next/router';
import { getPositions } from '../../services/positionService';
import { getAllEmployees } from '../../services/employeeService';
import { addProjectPosition } from '../../services/projectPositionService';


let options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

let selectedManagerId


const generateBoundInputs = (data) => {
  if(data != undefined)
    return data.map(element => 
        (<div><div className="custom-label">{element.name} Sayısı</div>
          <Form.Group widths='equal'>
            <Form.Input fluid name={'minNumberOf' + element.id} type="number" label="" placeholder="min"/>
            <Form.Input fluid name={'maxNumberOf' + element.id} type="number" label="" placeholder="max"/>
          </Form.Group>
      </div>))     
}

const addProjectForm = () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState(null)
  const [workers, setWorkers] = useState(null)

  const router = useRouter();
  if(!positions)
    getPositions().then(res => {setPositions(res.data)}).catch(err => console.log(err));

  getAllEmployees().then(res => {
    setWorkers(res.data)
  }).catch(err => console.log(err));

  const createProject = useCallback(async (event) => {
    setLoading(true)
    
    const name = event.target.name.value;
    const plannedStartDate = event.target.plannedStartDate.value;
    const plannedDeliveryDate = event.target.plannedDeliveryDate.value;

    const minMaxValues = [];

    if(positions){
      const target = event.target
      positions.forEach(element => {
        minMaxValues.push({
          key: element.id,
          max: target["maxNumberOf" + element.id].value,
          min: target["minNumberOf" + element.id].value
        })
      });
    }

    const jsonObject = JSON.stringify({
      name: name,
      managerId: selectedManagerId,
      plannedStartDate: plannedStartDate,
      plannedDeliveryDate: plannedDeliveryDate,
      valid: true,
      active: true,
    });

    addProject(jsonObject).then(res => {
      minMaxValues.forEach(element => {
        const map = {
          projectId: res.data.id,
          positionId: element.key,
          minWorker: element.min,
          maxWorker: element.max,
        }
        addProjectPosition(map).then(response => router.push('/project/projects')).catch(err => console.log(err))
      })
    }).catch(err => console.log(err));
  });

  if(!workers){
    return (    
      <Loader active/>
      );
  }

  return (
    <Layout>
      <Form onSubmit={createProject}>
        <Form.Input name="name" type="text" label="Proje Adı" />
        <Form.Input name="plannedStartDate" type="date" label="Planlanan Başlangıç Tarihi" />
        <Form.Input name="plannedDeliveryDate" type="date" label="Planlanan Teslim Tarihi" />
        <Form.Select label="Proje Yöneticisi" options={workers.map(element => {return { key: element.id, value: element.name +" " + element.surname, text: element.name +" " + element.surname }})} onChange={(e, data) => {selectedManagerId = (data.options.find(element => (element.value === data.value)).key);}}/>

        {generateBoundInputs(positions)}
        <Button
          floated="right"
          icon
          labelPosition="left"
          style={{ marginBottom: '2rem' }}
          positive
          type="submit"
        >
          <Icon name="plus"></Icon>
            Projeyi Olustur
        </Button>
      </Form>
    </Layout>
  );
};

export default addProjectForm;
