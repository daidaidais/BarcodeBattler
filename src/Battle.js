import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import firebase from 'firebase';
import 'firebase/firestore';
import { firestore } from './firebase';
import Attack from './Attack';

const scanBtn = {
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
  margin: '30px auto',
  height:'100px',
  fontSize:'20px'
  };

var cardStyle = {
    display: 'flexbox'
}

const modalStyle = {
    position: 'absolute',
    display: 'inline',
    width: '90%',
    height:'95%',
    backgroundColor: '#F5F5F5',
    padding: '20px'
};

const modalTitle = {
    color:'black',
    textAlign:'center',
    marginBottom:'30px'
};

const modalText={
  fontSize: '15px',
  marginTop:'10px',
  marginBottom:'10px',
  fontWeight:'600',
  color:'black',
  textAlign:'center',
  height: '70px'
}

const modalImage={
  textAlign:'center',
  marginTop:'10px',
  marginBottom:'10px'
}

const modalProgress={
  marginTop:'10px',
  marginBottom:'10px'
}

const modalWinner={
  marginTop:'10px',
  marginBottom:'10px',
  fontSize:'30px',
  fontWeight:'700',
  textAlign:'center'
}

export default class Battle extends React.Component {

  constructor(){
    super();
    this.state = {
      winner:null,
      modal:false,
      price:[],
      hits:[],
      janTotal:[],
      image:[],
      name:[],
      code:[],
      review:[],
      hp:[],
      attackTurn:0,
      attacked:null
    };
    this.handleOpen=this.handleOpen.bind(this);
    this.handleClose=this.handleClose.bind(this);
    this.resetScan=this.resetScan.bind(this);
    this.setStatsToState=this.setStatsToState.bind(this);
    this.setHp=this.setHp.bind(this);
    this.setWinner=this.setWinner.bind(this);
    this.setPotion=this.setPotion.bind(this);
  }

  propTypes: {
  }

  setStatsToState(){
    this.setState({
      price:[this.props.stats1[0],this.props.stats2[0]],
      hits:[this.props.stats1[1],this.props.stats2[1]],
      janTotal:[this.props.stats1[2],this.props.stats2[2]],
      image:[this.props.stats1[3],this.props.stats2[3]],
      review:[this.props.stats1[4],this.props.stats2[4]],
      name:[this.props.name1,this.props.name2],
      code:[this.props.result1[0].codeResult.code,this.props.result2[0].codeResult.code],
      hp:[100,100]
    });
    this.handleOpen();
  }

  handleOpen = () => {
    this.setState({ modal: true });
  };

  handleClose = () => {
    this.setState({ modal: false });
    this.props.resetScan();
  };

  componentWillUnmount(){
    this.setState({
      winner: null,
      turn:0
    });
  }

  resetScan(){
    this.props.resetScan();
  }

  setHp(newHp,newPrice){
    let currentTurn = this.state.attackTurn;
    let newTurn = 0;
    currentTurn==0 ? newTurn=1 : newTurn=0;
    this.setState({
      hp:newHp,
      price:newPrice,
      attackTurn:newTurn,
      attacked:newTurn
    })
    if(newHp[0]==0 || newHp[1]==0){
      setTimeout(() => {
            this.setWinner(currentTurn);
        }, 1000);
    }
  };

  setWinner(player){
    this.setState({
      winner:player
    });
    const winnerCode = this.state.code[player];
    firestore.collection('barcodes').doc(winnerCode)
    .get()
    .then(doc=>{
      console.log('updating ',doc.id,':',doc.data().wins);
      let winsTemp = doc.data().wins;
      console.log("winsTemp:"+winsTemp+'->'+(winsTemp+1));
      //register to firestore
      firestore.collection("barcodes").doc(winnerCode).update({
          wins:winsTemp+1
        });
      });
  }

  setPotion(newJanTotal){
    let currentTurn = this.state.attackTurn;
    let newTurn = 0;
    currentTurn==0 ? newTurn=1 : newTurn=0;
    this.setState({
      janTotal:newJanTotal,
      attackTurn:newTurn,
      attacked:null
    })
  }

  render() {

    const initialPrice=[this.props.stats1[0],this.props.stats2[0]];

    return (
      <div>
        <Button variant='contained' color='secondary' onClick={this.setStatsToState} style={scanBtn} fullWidth='true'>BATTLE</Button>
        <Modal
          aria-labelledby="battle-modal-title"
          aria-describedby="battle-modal-description"
          open={this.state.modal}
          onClose={this.handleClose}
          disableAutoFocus={true}
          style={{display:'inline'}}
        >
          <div style={modalStyle}>
            <Typography variant="h4" id="battle-modal-title" style={modalTitle}>
              {this.state.winner==null ? 'BATTLE' : 'WINNER'}
            </Typography>
            {this.state.winner==null ?
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <div style={cardStyle}>
                    <Typography type='h5' color='inherit' style={modalText}>
                      {this.state.name[0]}
                    </Typography>
                    </div>
                    <div style={modalImage} className={this.state.attacked==0 ? 'attacked': null}>
                      <img src={this.state.image[0]} width="100%"/>
                    </div>
                    <Typography type='h6' color='inherit'>HP:{this.state.price[0]}</Typography>
                    <Typography type='h6' color='inherit'>DEF:{this.state.hits[0]}</Typography>
                    <LinearProgress variant="determinate" value={this.state.hp[0]} style={modalProgress}/>
                    <Attack initialPrice={initialPrice} price={this.state.price} hp={this.state.hp} hits={this.state.hits} janTotal={this.state.janTotal} review={this.state.review} player={0} setHp={this.setHp} attackTurn={this.state.attackTurn} setPotion={this.setPotion}/>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <div style={cardStyle}>
                    <Typography type='h5' color='inherit' style={modalText}>
                      {this.state.name[1]}
                    </Typography>
                    </div>
                    <div style={modalImage} className={this.state.attacked==1 ? 'attacked': null}>
                      <img src={this.state.image[1]} width="100%"/>
                    </div>
                    <Typography type='h6' color='inherit'>HP:{this.state.price[1]}</Typography>
                    <Typography type='h6' color='inherit'>DEF:{this.state.hits[1]}</Typography>
                    <LinearProgress variant="determinate" value={this.state.hp[1]} style={modalProgress} />
                    <Attack initialPrice={initialPrice} price={this.state.price} hp={this.state.hp} hits={this.state.hits} janTotal={this.state.janTotal} review={this.state.review} player={1} setHp={this.setHp} setWinner={this.setWinner} attackTurn={this.state.attackTurn} setPotion={this.setPotion}/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            : null}
            {this.state.winner!=null ?
              <div>
                <Typography variant="h3" color="secondary" style={modalWinner}>
                  {this.state.name[this.state.winner]}
                </Typography>
                <div style={modalImage}>
                  <img src={this.state.image[this.state.winner]}/>
                </div>
                <div style={{textAlign:'center',marginTop:'30px'}}>
                  <Button variant='contained' color='secondary' onClick={this.resetScan} size='small'>NEXT BATTLE</Button>
                </div>
              </div>
               : null}
          </div>
        </Modal>
      </div>
    );
  }
};
