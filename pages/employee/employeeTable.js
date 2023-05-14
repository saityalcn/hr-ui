import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table, Button, Form, Tab, Icon, Card,Modal, Header, Image, Grid, Container, Loader } from 'semantic-ui-react';
import { useEffect } from 'react'
import { useState,useCallback } from 'react';
import { useRouter } from 'next/router';
import {getAllEmployees} from '../../services/employeeService'

var selectedEmployee = {};

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


const renderEmployeeDetail = () => {
  const formattedEmployee = formatEmployee(selectedEmployee)
    return(
      <Tab.Pane>
        <Grid columns="equal">
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İsim</Header>
              </Grid.Column>
              <Grid.Column>{formattedEmployee.name}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Soyad</Header>
              </Grid.Column>
              <Grid.Column>{formattedEmployee.surname}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Brüt Maaş</Header>
              </Grid.Column>
              <Grid.Column>{formattedEmployee.salary}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Ünvan </Header>
              </Grid.Column>
              <Grid.Column>{formattedEmployee.position}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İşe Alım Tarihi </Header>
              </Grid.Column>
              <Grid.Column>{formattedEmployee.recruitmentDate}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Tab.Pane>
    );
}

const renderEmployeeActions = () => {
  const formattedEmployee = formatEmployee(selectedEmployee)
  return(
    <Tab.Pane>
        <Container>
          <div style={{paddingTop: 10 + "px", paddingBottom: 10 + "px"}}>Brüt Maaş: {formattedEmployee.salary}</div>
          <div style={{paddingTop: 10 + "px", paddingBottom: 10 + "px"}}>Çalışılan Gün Sayısı: { getDaysBetweenDates(selectedEmployee.recruitmentDate, new Date())} gün</div>
          <div style={{paddingTop: 10 + "px", paddingBottom: 10 + "px"}}>
            <a href="https://logo.cloud/uygulamalar/maas-hesaplama" target='_blank'>Maaş Hesapla</a>
            <a href="https://logo.cloud/uygulamalar/maas-hesaplama" target='_blank' style={{marginLeft: 20 + "px"}}>Tazminat Hesapla</a>
          </div>
        </Container>
    </Tab.Pane>
  );
}

function getDaysBetweenDates(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  console.log(startDate);
  const start = new Date(startDate);
  const end = new Date(endDate);

  console.log(start)
  console.log(end)

  const diffDays = Math.round(Math.abs((start - end) / oneDay));

  console.log(diffDays)
  return diffDays;
}

const renderEmployees = (employeeData, [open, setOpen]) => {
    const panes = [
      { menuItem: 'Bilgiler', render: () => renderEmployeeDetail()},
      { menuItem: 'İşlemler', render: () => renderEmployeeActions()},
    ]

    return employeeData.map((employee) => {
      const formattedEmployee = formatEmployee(employee)
      return (
        <Table.Row>
            <Table.Cell>{formattedEmployee.id}</Table.Cell>
            <Table.Cell>{formattedEmployee.name}</Table.Cell>
            <Table.Cell>{formattedEmployee.surname}</Table.Cell>
            <Table.Cell>{formattedEmployee.ssn}</Table.Cell>
            <Table.Cell>{formattedEmployee.salary}</Table.Cell>
            <Table.Cell>{formattedEmployee.position}</Table.Cell>
            <Table.Cell>{formattedEmployee.recruitmentDate}</Table.Cell>
            <Table.Cell>
                <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                <Button animated='fade' primary onClick={() => {selectedEmployee = employee}}>
                    <Button.Content visible>Detay</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
                }>
                    <Modal.Header>Çalışan Detay</Modal.Header>
                    <Modal.Content>
                      <Modal.Description>
                        <Tab panes={panes}></Tab>
                      </Modal.Description> 
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => setOpen(false)}>Geri Dön</Button>
                    </Modal.Actions>
                </Modal>

            </Table.Cell>
        </Table.Row>
      );
    });
};

function employeeTable(){
  const router = useRouter();
  const [data, setData] = useState(null);
  const [open, setOpen] = React.useState(false);

  if(!data)
    getAllEmployees().then(res => setData(res.data)).catch(err => console.log(err))

  if(data == null)
    return (<Loader active/>)
  
  return (
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

      <Table.Body>{renderEmployees(data,[open, setOpen])}</Table.Body>
      <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell/>
            <Table.HeaderCell>
              <Button floated="right" primary size="small" fluid onClick={() => {router.push('/employee/addEmployee');}}>
                <Icon name="plus circle" /> Çalışan Ekle
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
    </Table>
  );
};

export default employeeTable;

