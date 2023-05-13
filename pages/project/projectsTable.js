import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table, Button, Form, Tab, Icon, Card,Modal, Header, Loader, Grid, Container,Dimmer,Message } from 'semantic-ui-react';
import { useEffect } from 'react'
import { useState,useCallback } from 'react';
import { useRouter } from 'next/router';

import {getExpiredProjects, finishProjectByProjectId, getProjectsWithManagers} from '../../services/projectService'
import {getWorkersByProjectId} from '../../services/employeeService'

let selectedProject;
let request = false;

const dateFormatter = (date) => {
  return new Date(date).toLocaleDateString("tr-TR")
}

const formatEmployee = (employee) => {
  const formatter = new Intl.NumberFormat('tr-TR',{style: 'currency', currency: 'TRY'})
  const newEmployee = {
    id: employee.id,
    name: employee.name,
    surname: employee.surname,
    ssn: employee.ssn,
    address: employee.address,
    telNo: employee.telNo,
    salary: formatter.format(employee.salary),
    position: employee.position,
    recruitmentDate: new Date(employee.recruitmentDate).toLocaleDateString("tr-TR"),
    termiantionDate: employee.termiantionDate,
  }

  return newEmployee;
}

const renderProjectDetail = () => {
    return(
      <Tab.Pane>
        <Grid reversed="tablet" columns="equal">
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İsim</Header>
              </Grid.Column>
              <Grid.Column>{selectedProject.projectName}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Planlanan Başlangıç Tarihi</Header>
              </Grid.Column>
              <Grid.Column>{dateFormatter(selectedProject.projectPlannedStartDate)}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Planlanan Teslim Tarihi </Header>
              </Grid.Column>
              <Grid.Column>{dateFormatter(selectedProject.projectPlannedDeliveryDate)}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Durumu </Header>
              </Grid.Column>
              <Grid.Column>{!selectedProject.projectValid && (
              <Message
                content="Yetersiz Çalışan"
                error
              />)}{
                (selectedProject.projectValid && (<Message
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
  if(!workerList){
    getWorkersByProjectId(selectedProject.projectId).then(res => {
      setWorkerList(res.data);
    })
  }

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

const showLoading = (loading) => {
  return 1;
}

const renderProjects = (projects, [open, setOpen], [workerList, setWorkerList], [openRemovedWorkersModal, setOpenRemovedWorkersModal], [removedWorkersList, setRemovedWorkersList]) => {

  const panes = [
    { menuItem: 'Bilgiler', render: () => renderProjectDetail()},
    { menuItem: 'Projede Çalışanlar', render: () => renderProjectEmployeeList([workerList, setWorkerList])},
  ]

  return projects.map((project) => {
    return (
      <Table.Row key={project.projectId}>
          <Table.Cell>{project.projectId}</Table.Cell>
          <Table.Cell>{project.projectName}</Table.Cell>
          <Table.Cell>{dateFormatter(project.projectPlannedStartDate)}</Table.Cell>
          <Table.Cell>{dateFormatter(project.projectPlannedDeliveryDate)}</Table.Cell>
          <Table.Cell>{project.projectManagerName + " " + project.projectManagerSurname}</Table.Cell>
          <Table.Cell>{!project.projectValid && project.projectActive && (
              <Message
                compact
                content="Yetersiz Çalışan"
                error
              />)}{
                (project.projectValid && project.projectActive && (<Message
                  compact
                  content="Uygun"
                  success
                />))}
                {
                (project.projectValid && !project.projectActive && (<Message
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
                project.projectActive &&
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
              <Modal
                onClose={() => setOpenRemovedWorkersModal(false)}
                onOpen={() => setOpenRemovedWorkersModal(true)}
                open={openRemovedWorkersModal}
                trigger={(project.projectActive && <Button inverted color='red' style={{marginLeft: 30 + "px"}} onClick={() => {
                  showLoading(true)
                  if(!request){
                    request = true;
                    sendFinishProjectRequest(project.projectId).then(res => {
                      showLoading(false);
                      setOpenRemovedWorkersModal(true);
                      setRemovedWorkersList(res.data);
                    });
                  }
                }}><Icon name='remove' />
                Kaldır</Button>)}>
                    <Modal.Header>Silinen Çalışanlar</Modal.Header>
                    <Modal.Content>
                    <Modal.Description>{  buildRemovedWorkersList(removedWorkersList,[openRemovedWorkersModal, setOpenRemovedWorkersModal])}</Modal.Description> 
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => setOpenRemovedWorkersModal(false)}>Kapat</Button>
                    </Modal.Actions>
              </Modal>
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

const buildRemovedWorkersList = (workersList,[openRemovedWorkersModal, setOpenRemovedWorkersModal]) => {
  if(workersList == null)
    return <Loader/>;
  
  return(
    <Tab.Pane>
      <Table unstackable padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Ad</Table.HeaderCell>
            <Table.HeaderCell>Soyad</Table.HeaderCell>
            <Table.HeaderCell>TC Kimlik</Table.HeaderCell>
            <Table.HeaderCell>Brüt Maaş</Table.HeaderCell>
            <Table.HeaderCell>Ünvan</Table.HeaderCell>
            <Table.HeaderCell>İşe Alım Tarihi</Table.HeaderCell>
            <Table.HeaderCell>Çalıştığı Gün Sayısı</Table.HeaderCell>
            <Table.HeaderCell>Tazminat Hesapla</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderDeletedEmployeesTable(workersList)}</Table.Body>
      </Table>
        
    </Tab.Pane>
  );
}

const renderDeletedEmployeesTable = (workerList) => {
  return workerList.map(employee => {
    employee = formatEmployee(employee)
    return (
      <Table.Row>
      <Table.Cell>{employee.id}</Table.Cell>
      <Table.Cell>{employee.name}</Table.Cell>
      <Table.Cell>{employee.surname}</Table.Cell>
      <Table.Cell>{employee.ssn}</Table.Cell>
      <Table.Cell>{employee.salary}</Table.Cell>
      <Table.Cell>{employee.position}</Table.Cell>
      <Table.Cell>{dateFormatter(employee.recruitmentDate)}</Table.Cell>
      <Table.Cell>{getDaysBetweenDates(employee.recruitmentDate, new Date())}</Table.Cell>
      <Table.Cell><a target='_blank' href="https://turmob.org.tr/hesaplamalar/kidemihbarvetazminati">Tazminat Hesapla</a></Table.Cell>
      <Table.Cell>
      </Table.Cell>
  </Table.Row>
    );
  });
}


function getDaysBetweenDates(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffDays = Math.round(Math.abs((start - end) / oneDay));

  return diffDays;
}

function projectsTable(){
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = useState(null);
  const [workerList, setWorkerList] = useState(null);
  const [openRemovedWorkersModal, setOpenRemovedWorkersModal] = useState(false);
  const [removedWorkersList, setRemovedWorkersList] = useState(null)

  if(router.pathname.includes("home") && !data){
    getExpiredProjects().then(res => {
      setData(res.data);
    }).catch(err => {
      console.log(err);
    })
  }
  else if(!data){
    getProjectsWithManagers().then(res => {
      setData(res.data);
    }).catch(err => console.log(err))
  }

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
          <Table.HeaderCell>Proje Yöneticisi</Table.HeaderCell>
          <Table.HeaderCell>Durumu</Table.HeaderCell>
          <Table.HeaderCell> </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{renderProjects(data,[open, setOpen], [workerList, setWorkerList], [openRemovedWorkersModal, setOpenRemovedWorkersModal], [removedWorkersList, setRemovedWorkersList])}</Table.Body>
      <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
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

