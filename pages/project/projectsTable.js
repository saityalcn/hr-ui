import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table, Button, Form, Tab, Icon, Card,Modal, Header, Loader, Grid, Container,Dimmer,Message } from 'semantic-ui-react';
import { useEffect } from 'react'
import { useState,useCallback } from 'react';
import { useRouter } from 'next/router';

import {getAllProjects, finishProjectByProjectId} from '../../services/projectService'
import {getWorkersByProjectId} from '../../services/employeeService'

let selectedProject;

const dateFormatter = (date) => {
  return new Date(date).toLocaleDateString("tr-TR")
}

const renderProjectDetail = () => {
    return(
      <Tab.Pane>
        <Grid reversed="tablet" columns="equal">
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İsim</Header>
              </Grid.Column>
              <Grid.Column>{selectedProject.name}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Planlanan Başlangıç Tarihi</Header>
              </Grid.Column>
              <Grid.Column>{dateFormatter(selectedProject.plannedStartDate)}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Planlanan Teslim Tarihi </Header>
              </Grid.Column>
              <Grid.Column>{dateFormatter(selectedProject.plannedDeliveryDate)}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Durumu </Header>
              </Grid.Column>
              <Grid.Column>{!selectedProject.valid && (
              <Message
                content="Yetersiz Çalışan"
                error
              />)}{
                (selectedProject.valid && (<Message
                  content="Uygun"
                  success
                />))
              }</Grid.Column>
          </Grid.Row>
        </Grid>
      </Tab.Pane>
    );
}

const renderProjectEmployeeList = ([workerList, setWorkerList]) => {

  getWorkersByProjectId(selectedProject.id).then(res => {
    setWorkerList(res.data);
  })

  if(workerList === null)
    return (<Loader active/>)

  return(
    <Tab.Pane>
      <Table unstackable padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Ad</Table.HeaderCell>
            <Table.HeaderCell>Soyad</Table.HeaderCell>
            <Table.HeaderCell>TC Kimlik</Table.HeaderCell>
            <Table.HeaderCell>Maaş</Table.HeaderCell>
            <Table.HeaderCell>Ünvan</Table.HeaderCell>
            <Table.HeaderCell>İşe Alım Tarihi</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderEmployeeTable(workerList)}</Table.Body>
      </Table>
        
    </Tab.Pane>
  );
}

const sendFinishProjectRequest = (projectId) => {
  return finishProjectByProjectId(projectId);
}

const renderProjects = (projects, [open, setOpen], [workerList, setWorkerList]) => {

  const panes = [
    { menuItem: 'Bilgiler', render: () => renderProjectDetail()},
    { menuItem: 'Projede Çalışanlar', render: () => renderProjectEmployeeList([workerList, setWorkerList])},
  ]

  return projects.map((project) => {
    return (
      <Table.Row>
          <Table.Cell>{project.id}</Table.Cell>
          <Table.Cell>{project.name}</Table.Cell>
          <Table.Cell>{dateFormatter(project.plannedStartDate)}</Table.Cell>
          <Table.Cell>{dateFormatter(project.plannedDeliveryDate)}</Table.Cell>
          <Table.Cell>{!project.valid && project.active && (
              <Message
                compact
                content="Yetersiz Çalışan"
                error
              />)}{
                (project.valid && project.active && (<Message
                  compact
                  content="Uygun"
                  success
                />))}
                {
                (project.valid && !project.active && (<Message
                  compact
                  content="Tamamlandı"
                  info
                />))}
          </Table.Cell>
          <Table.Cell>
              <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              trigger={
                project.active &&
              <Button animated='fade' primary onClick={() => {selectedProject = project}}>
                  <Button.Content visible>Detay</Button.Content>
                  <Button.Content hidden>
                      <Icon name='arrow right' />
                  </Button.Content>
              </Button>
              }>
                  <Modal.Header>Proje Detay</Modal.Header>
                  <Modal.Content>
                  <Modal.Description><Tab panes={panes}></Tab></Modal.Description> 
                  </Modal.Content>
                  <Modal.Actions>
                      <Button negative onClick={() => setOpen(false)}>Geri Dön</Button>
                  </Modal.Actions>
              </Modal>
            { project.active && <Button inverted color='red' style={{marginLeft: 30 + "px"}} onClick={() => {
              showLoading(true)
              sendFinishProjectRequest(project.id).then(res => {
                showLoading(false)
                console.log(res);
              });
            }}>
                <Icon name='remove' />
                    Kaldır
            </Button>}
          </Table.Cell>
      </Table.Row>
    );
  });
  
};

const renderEmployeeTable = (workerList) => {
  return workerList.map((employee) => {
    return (
      <Table.Row>
      <Table.Cell>{employee.id}</Table.Cell>
      <Table.Cell>{employee.name}</Table.Cell>
      <Table.Cell>{employee.surname}</Table.Cell>
      <Table.Cell>{employee.ssn}</Table.Cell>
      <Table.Cell>{employee.salary}</Table.Cell>
      <Table.Cell>{employee.position}</Table.Cell>
      <Table.Cell>{dateFormatter(employee.recruitmentDate)}</Table.Cell>
      <Table.Cell>
      </Table.Cell>
  </Table.Row>
    );
  });
}

function projectsTable(){
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = useState(null);
  const [workerList, setWorkerList] = useState(null);
  const [openRemovedWorkersModel, setOpenRemovedWorkersModel] = useState(false);

  getAllProjects().then(res => {
    setData(res.data);
  }).catch(err => console.log(err))


  if(data == null){
    return (    
      <Loader active/>
      );
  }

  return (
    <Table unstackable padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>İsim</Table.HeaderCell>
          <Table.HeaderCell>Planlanan Başlangıç Tarihi</Table.HeaderCell>
          <Table.HeaderCell>Planlanan Teslim Tarihi</Table.HeaderCell>
          <Table.HeaderCell>Durumu</Table.HeaderCell>
          <Table.HeaderCell> </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{renderProjects(data,[open, setOpen], [workerList, setWorkerList])}</Table.Body>
      <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell>
              <Button floated="right" primary size="small" fluid onClick={() => {router.push('/project/addProject');}}>
                <Icon name="plus circle" /> Yeni Proje
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
    </Table>
  );
};

export default projectsTable;

