import React, { Component } from 'react';

import 'typeface-roboto';
import CssBaseline from 'material-ui/CssBaseline';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const EthereumTx = require('ethereumjs-tx');

const styles = {
  header: {
    marginBottom: "2em",
  },
  title: {
    color: "white",
    flex: 1,
  },
  paper: {
    padding: "1em",
  },
  pos: {
    marginBottom: "1em",
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.deserialize = this.deserialize.bind(this);
  }

  handleChange(event) {
    this.setState({sTx: event.target.value});
  }

  deserialize(event) {
    event.preventDefault();

    var error;

    try {
      var dTx = new EthereumTx(this.state.sTx);
      error = dTx.validate(true);
    } catch(err) {
      error = err.message;
    }

    if (error) {
      this.setState({
        dTx: undefined,
        error,
      });
    } else {
      this.setState({
        dTx,
        error,
        from: "0x" + dTx.from.toString("hex"),
        to: "0x" + dTx.to.toString("hex"),
        value: parseInt(dTx.value.toString("hex"), 16),
        gas: parseInt(dTx.gas.toString("hex"), 16),
        gasPrice: parseInt(dTx.gasPrice.toString("hex"), 16),
        nonce: parseInt(dTx.nonce.toString("hex"), 16) || 0,
        etherscanURL: "https://etherscan.io/tx/0x" + dTx.hash().toString("hex"),
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className="App">
          <AppBar position="static" className={classes.header}>
            <Toolbar>
              <Typography variant="title" className={classes.title}>
                Ethereum Tx Deserializer
              </Typography>
              <Button variant="raised" color="secondary" href="https://github.com/lifeonmarspt/eth-tx-deserializer">GitHub</Button>
            </Toolbar>
          </AppBar>
          <Grid container justify="center">
            <Grid item xs={11}>
              <form onSubmit={this.deserialize}>
                <Grid container spacing={24} alignItems="baseline">
                  <Grid item xs={10}>
                    <TextField fullWidth label="Serialized Tx" onChange={this.handleChange} />
                  </Grid>
                  <Grid item xs={2}>
                    <Button fullWidth variant="raised" color="primary" onClick={this.deserialize}>Deserialize</Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      {!this.state.dTx && !this.state.error &&
                        <Typography>
                          Paste your serialized transaction above and hit the button.
                        </Typography>
                      }
                      {this.state.error &&
                        <Typography>
                          {this.state.error}
                        </Typography>
                      }
                      {this.state.dTx &&
                        <React.Fragment>
                          <Typography color="textSecondary">
                            From
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.from}
                          </Typography>
                          <Typography color="textSecondary">
                            To
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.to}
                          </Typography>
                          <Typography color="textSecondary">
                            Value
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.value}
                          </Typography>
                          <Typography color="textSecondary">
                            Gas
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.gas}
                          </Typography>
                          <Typography color="textSecondary">
                            Gas price
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.gasPrice}
                          </Typography>
                          <Typography color="textSecondary">
                            Nonce
                          </Typography>
                          <Typography variant="headline" className={classes.pos}>
                            {this.state.nonce}
                          </Typography>
                          <Button variant="raised" color="primary" href={this.state.etherscanURL}>View in Etherscan</Button>
                        </React.Fragment>
                      }
                    </Paper>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
