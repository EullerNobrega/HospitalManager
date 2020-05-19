import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from "revalidate";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { IPaciente } from "../../../app/models/paciente";

const validate = combineValidators({
  nome: isRequired("nome"),
  email: isRequired("email"),
});

interface DetailParams {
  id: string;
}

const PacienteForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createPaciente,
    editPaciente,
    submitting,
    loadPaciente,
    setLoading,
    paciente,
    loading,
  } = rootStore.pacienteStore;

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadPaciente(parseInt(match.params.id)).then(() => setLoading(false));
    }
  }, [loadPaciente, match.params.id, setLoading]);

  const handleFinalFormSubmit = (values: any) => {
    if (!paciente) {
      createPaciente(paciente!);
    } else {
      editPaciente(paciente!);
    }
  };
  if (!paciente) {
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment clearing>
            <FinalForm
              onSubmit={(values: IPaciente) => createPaciente(values)}
              validate={validate}
              render={({ handleSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} loading={loading}>
                  <Field name="nome" placeholder="Nome" component={TextInput} />
                  <Field
                    name="email"
                    placeholder="E-mail"
                    component={TextInput}
                  />
                  <Button
                    loading={submitting}
                    disabled={loading || invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
                    onClick={() => history.push("/pacienteDashboard")}
                    disabled={loading}
                    floated="right"
                    type="button"
                    content="Cancel"
                  />
                </Form>
              )}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  } else {
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment clearing>
            <FinalForm
              validate={validate}
              initialValues={paciente}
              onSubmit={handleFinalFormSubmit}
              render={({ handleSubmit, invalid, pristine }) => (
                <Form onSubmit={handleSubmit} loading={loading}>
                  <Field
                    name="nome"
                    placeholder="Nome"
                    value={paciente.nome}
                    component={TextInput}
                  />
                  <Field
                    name="email"
                    placeholder="E-mail"
                    value={paciente.email}
                    component={TextInput}
                  />
                  <Button
                    loading={submitting}
                    disabled={loading || invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
                    onClick={() => history.push("/pacienteDashboard")}
                    disabled={loading}
                    floated="right"
                    type="button"
                    content="Cancel"
                  />
                </Form>
              )}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
};

export default observer(PacienteForm);
