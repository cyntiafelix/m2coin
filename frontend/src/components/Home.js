import React, { Component } from "react";
import {
  Col,
  Row,
  FormGroup,
  Form,
  Button,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import Axios from "axios";


class Home extends Component{
  constructor(props) {
     super(props);
     this.state = {
       id:'',
       created:'',
       title: '',
       short_description:'',
       long_description:'',
       location:'',
       zipcode:'',
       price:'',
       stock:'',
       showModal: false,
       deleteId: '',
       showConfirm: false,
       publications: [],
       errors:{},
     };
     this.handleModal = this.handleModal.bind(this);
     this.handleConfirm = this.handleConfirm.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleDelete = this.handleDelete.bind(this);
   }

  componentDidMount(){
    this.getPublications()
  }

  async getPublications(){
    try {
      const response = await Axios.get('http://localhost:3001/api/getall')
      this.setState({ publications: response.data })
    } catch (error){
     console.log(error)
    }
  }

  handleSelected(id){
    if (id==0){
      this.setState({
        id:'',
        created:'',
        title: '',
        short_description:'',
        long_description:'',
        location:'',
        zipcode:'',
        price:'',
        stock:'',
        errors:{}
      })
    } else {
      const publication = this.state.publications.filter(p => p.id === id)[0]
      this.setState({
        id: publication.id,
        created: moment(publication.created).format("YYYY-MM-DD") ,
        title: publication.title,
        short_description: publication.short_description,
        long_description: publication.long_description,
        location: publication.location,
        zipcode: publication.zipcode,
        price: publication.price,
        stock: publication.stock,
        errors:{}
      })
    }

    this.handleModal();
  }

  handleModal(){
    this.setState({
      showModal: !this.state.showModal
    })
  }

  handleChange(event) {
     this.setState({
       [event.target.name]: event.target.value
     });
  }

  async handleSubmit(event) {
    event.preventDefault()
    let errors = {};
    if (this.state.created == '') errors['created'] = 'Fecha de creacion es requerida';
    if (this.state.title == '') errors['title'] = 'Titulo es requerido';
    if (this.state.short_description == '') errors['short_description'] = 'Descripcion corta es requerida';
    if (this.state.long_description == '') errors['long_description'] = 'Descripcion larga es requerida';
    if (this.state.location == '') errors['location'] = 'Ubicacion es requerida';
    if (this.state.zipcode == '') errors['zipcode'] = 'Codigo Postal es requerido';
    if (this.state.price == '') errors['price'] = 'Precio es requerido y numerico';
    if (Object.keys(errors).length > 0){
      this.setState({
        errors: errors
      })
      return
    }
    try {
      if (this.state.id == 0) {
        let response = await Axios.post('http://localhost:3001/api/new', this.state)
      } else {
        let response = await Axios.put('http://localhost:3001/api/update', this.state)
      }
      this.setState({
         showModal: false,
         errors: {}
      })
    } catch (error){
      console.log(error)
    }
    this.getPublications()
  }

  handleDeletion(id){
    this.setState({
      deleteId: id,
      showConfirm: true
    })
  }

  handleConfirm(){
    this.setState({
      showConfirm: !this.state.showConfirm
    })
  }

  async handleDelete(){
    try {
      await Axios.delete(`http://localhost:3001/api/delete/${this.state.deleteId}`)
      this.setState({
         deleteId: '',
         showConfirm: false,
      })
    } catch (error){
     console.log(error)
    }

    this.getPublications()
  }

  render() {
    const classes = this.props.styleClasses;
    const fieldList = [['date','created','Fecha Creacion'],
    ['text', 'title','Titulo'],
    ['text', 'short_description','Descripcion Corta'],
    ['text', 'long_description', 'Descripcion Larga'],
    ['text', 'location','Ubicacion'],
    ['text', 'zipcode','Codigo Postal'],
    ['number', 'price', 'Precio'],
    ['number', 'stock', 'Cantidad Disponible']]

    return (
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button color="primary" onClick={() => this.handleSelected(0)}>Nueva Publicacion</Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {this.state.publications.map((p) => {
              return (
                <Grid item key={p.id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title="Image title"/>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {p.title}
                      </Typography>
                      <div>
                        <Row>
                          <Col>Descripcion Corta: {p.short_description}</Col>
                        </Row>
                        <Row>
                          <Col>Descripcion Larga: {p.long_description}</Col>
                        </Row>
                        <Row>
                          <Col>Ubicacion: {p.location}, CP. {p.zipcode}</Col>
                        </Row>
                        <Row>
                          <Col>Precio: <NumberFormat value={p.price} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                        </Row>
                        <Row>
                          <Col>Cantidad Disponible: {p.stock}</Col>
                        </Row>
                        <Row>
                          <Col> Fecha Publicacion: {moment(p.created).format("DD/MM/YYYY")} </Col>
                        </Row>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => this.handleDeletion(p.id)}>
                        Borrar
                      </Button>
                      <Button size="small" color="primary" onClick={() => this.handleSelected(p.id)}>
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>


          <Modal isOpen={this.state.showModal} toggle={this.handleModal}>
            <ModalHeader className="modal-header" toggle={this.handleModal}>
              {this.state.id != '' ? 'EDITAR' : 'NUEVA'} PUBLICACION
            </ModalHeader>
            <ModalBody className="modal-body">
            <Form className="form">
            <Col>
                { fieldList.map((field, i) => {
                  const fieldtype = field[0];
                  const fieldname = field[1];
                  const fieldlabel = field[2];
                  return(
                    <FormGroup key={i} row>
                      <Label for={fieldname} sm={2}>{fieldlabel}</Label>
                      <Col sm={10}>
                        <Input type={fieldtype} name={fieldname} value={this.state[fieldname]} onChange={(e) => this.handleChange(e)}/>
                        <FormHelperText style={{ color: 'red' }} id="component-error-text">
                        {this.state.errors && this.state.errors[fieldname] ? this.state.errors.[fieldname] : null }
                        </FormHelperText>
                      </Col>
                    </FormGroup>
                  )
                })
                }
              </Col>
            </Form>
            </ModalBody>
            <ModalFooter className="modal-footer">
              <Button onClick={this.handleModal}>Cancelar</Button>
              <Button color="primary" onClick={this.handleSubmit}>Guardar</Button>
            </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.showConfirm} toggle={this.handleConfirm}>
              <ModalHeader className="modal-header" toggle={this.handleConfirm}>BORRAR PUBLICACION</ModalHeader>
              <ModalBody className="modal-body">
                 ¿Esta seguro que quiere borrar esta publicacion?
              </ModalBody>
              <ModalFooter className="modal-footer">
                <Button onClick={this.handleConfirm}>Cancelar</Button>
                <Button color="primary" onClick={this.handleDelete}>Borrar</Button>
              </ModalFooter>
              </Modal>

          </main>
    );
  }
}

export default Home;
