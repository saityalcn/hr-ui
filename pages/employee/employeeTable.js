import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Table, Button, Form, Tab, Icon, Card,Modal, Header, Image, Grid, Container, Loader } from 'semantic-ui-react';
import { useEffect } from 'react'
import { useState,useCallback } from 'react';
import { useRouter } from 'next/router';
import {getAllEmployees} from '../../services/employeeService'

var selectedEmployee = {};

var employeeIdToDelete;

const renderEmployeeDetail = () => {
    return(
      <Tab.Pane>
        <Grid reversed="tablet" columns="equal">
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İsim</Header>
              </Grid.Column>
              <Grid.Column>{selectedEmployee.name}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Şube</Header>
              </Grid.Column>
              <Grid.Column>{selectedEmployee.branch_name}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Maaş </Header>
              </Grid.Column>
              <Grid.Column>{selectedEmployee.employee_salary}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">Durumu </Header>
              </Grid.Column>
              <Grid.Column>{selectedEmployee.awl}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Grid.Column>
              <Header as="h3">İzin Bitiş </Header>
              </Grid.Column>
              <Grid.Column>{selectedEmployee.awl_date}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Tab.Pane>
    );
}

let sendSetAwlRequest;

const renderEmployeeActions = () => {
  return(
    <Tab.Pane>
        <Container>
        <Form onSubmit={sendSetAwlRequest}>
          <Form.Group widths='equal'>
            <Container>
              <Container><Form.Input type='date' name="dateawl" label='İzin Bitiş'/></Container>
              <Card><Button type='submit' primary>İzin Ver</Button></Card>
            </Container>
          </Form.Group>
        </Form>
        </Container>
    </Tab.Pane>
  );
}

const renderEmployees = (employeeData, [open, setOpen]) => {
    const panes = [
      { menuItem: 'Bilgiler', render: () => renderEmployeeDetail()},
      { menuItem: 'İşlemler', render: () => renderEmployeeActions()},
    ]

    return employeeData.map((employee) => {
      return (
        <Table.Row>
            <Table.Cell>{employee.id}</Table.Cell>
            <Table.Cell>{employee.name}</Table.Cell>
            <Table.Cell>{employee.surname}</Table.Cell>
            <Table.Cell>{employee.ssn}</Table.Cell>
            <Table.Cell>{employee.salary}</Table.Cell>
            <Table.Cell>{employee.positionId}</Table.Cell>
            <Table.Cell>{new Date(employee.recruitmentDate).toLocaleDateString("tr-TR")}</Table.Cell>
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
                    <Modal.Content image>
                    <Image size='medium' src='https://64.media.tumblr.com/8bdfdc91727c878fda5663518897a26b/8a346e6666396b18-c4/s640x960/6309630712ed212729ee51956c0c24862bfc8847.jpg' wrapped />
                    <Modal.Description><Tab panes={panes}></Tab></Modal.Description> 
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => setOpen(false)}>Geri Dön</Button>
                    </Modal.Actions>
                </Modal>

            </Table.Cell>
            <Table.Cell>
            <Button inverted color='red' onClick={() => {
                employeeIdToDelete = employee.employee_id;
                sendRequest();
              }}>
                <Icon name='remove' />
                    Kaldır
            </Button>
            </Table.Cell>
        </Table.Row>
      );
    });
};

function employeeTable(){
  const router = useRouter();
  const [data, setData] = useState(null);
  const [open, setOpen] = React.useState(false);

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

