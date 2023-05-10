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


let options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

let selectedManagerId


const addProjectForm = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const createProject = useCallback(async (event) => {
    setLoading(true)
    
    const name = event.target.name.value;
    const plannedStartDate = event.target.plannedStartDate.value;
    const plannedDeliveryDate = event.target.plannedDeliveryDate.value;
    const minNumberOfAnalysts = event.target.minNumberOfAnalysts.value;
    const maxNumberOfAnalysts = event.target.maxNumberOfAnalysts.value;
    const minNumberOfDesigners = event.target.minNumberOfDesigners.value;
    const maxNumberOfDesigners = event.target.maxNumberOfDesigners.value;
    const minNumberOfDevelopers = event.target.minNumberOfDevelopers.value;
    const maxNumberOfDevelopers = event.target.maxNumberOfDevelopers.value;
    /*
    const jsonObject = JSON.stringify({
      name: name,
      selectedManagerId: selectedManagerId,
      plannedStartDate: plannedStartDate,
      plannedDeliveryDate: plannedDeliveryDate,
      minNumberOfAnalysts: minNumberOfAnalysts,
      maxNumberOfAnalysts: maxNumberOfAnalysts,
      minNumberOfDesigners: minNumberOfDesigners,
      maxNumberOfDesigners: maxNumberOfDesigners,
      minNumberOfDevelopers: minNumberOfDevelopers,
      maxNumberOfDevelopers: maxNumberOfDevelopers,
    });
    */

    const jsonObject = JSON.stringify({
      name: name,
      selectedManagerId: 1,
      plannedStartDate: plannedStartDate,
      plannedDeliveryDate: plannedDeliveryDate,
      valid: true,
      active: true,
    });

    addProject(jsonObject).then(res => {
      setLoading(true)
      router.push('/project/projects')
    }).catch(err => console.log(err));
  });

  if(loading){
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
        <Form.Select label="Proje Yöneticisi" options={options} onChange={(e, data) => {selectedManagerId = data.value;}}/>

        <div className="custom-label">Analist Sayısı</div>
          <Form.Group widths='equal'>
            <Form.Input fluid name="minNumberOfAnalysts" type="number" label="" placeholder="min"/>
            <Form.Input fluid name="maxNumberOfAnalysts" type="number" label="" placeholder="max"/>
        </Form.Group>

        <div className="custom-label">Tasarımcı Sayısı</div>
        <Form.Group widths='equal'>
          <Form.Input fluid name="minNumberOfDesigners" type="number" label="" placeholder="min"/>
          <Form.Input fluid name="maxNumberOfDesigners" type="number" label="" placeholder="max"/>
        </Form.Group>

        <div className="custom-label">Yazılımcı Sayısı</div>
        <Form.Group widths='equal'>
          <Form.Input fluid name="minNumberOfDevelopers" type="number" label="" placeholder="min"/>
          <Form.Input fluid name="maxNumberOfDevelopers" type="number" label="" placeholder="max"/>
        </Form.Group>

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
