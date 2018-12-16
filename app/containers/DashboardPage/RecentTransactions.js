import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import Material-UI
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Import Components
import LoadingCircular from 'components/LoadingCircular';

// Import Internationalize
import { FormattedMessage } from 'react-intl';
import messages from './messages';

// Import Styles
const styles = theme => ({
  root: {
    padding: 0,
  },
  card: {
    height: 245,
    borderRadius: 0,
    boxShadow: 'none',
    border: '1.3px solid rgba(0, 0, 0, 0.12)',
  },
  typographyTitle: {
    padding: '10px 25px',
    position: 'relative',
  },
  tableCell: {
    padding: '4px 0px 4px 28px',
  },
  loadingCircular: {
    display: 'flex',
    height: 193,
    flexDirection: 'row',
  },
  outgoingTransfer: {
    color: '#ea0000',
  },
});

const sortingData = data =>
  data.sort((a, b) => Date.parse(b.data_time) - Date.parse(a.data_time));

class RecentTransactions extends Component {
  constructor() {
    super();

    this.state = {
      recentTransactionsSender: [],
      recentTransactionsRecipient: [],
      isLoading: true,
    };
  }

  // test
  componentDidMount() {
    axios
      .all([
        axios.get('http://localhost:3000/api/transactions/recipient/1'),
        axios.get('http://localhost:3000/api/transactions/sender/1'),
      ])
      .then(
        axios.spread(
          (recentTransactionsRecipient, recentTransactionsSender) => {
            this.setState({
              recentTransactionsRecipient: recentTransactionsRecipient.data,
              recentTransactionsSender: recentTransactionsSender.data,
              isLoading: false,
            });
          },
        ),
      )
      .catch(err => {});
  }

  render() {
    const { classes } = this.props;
    const {
      recentTransactionsRecipient,
      recentTransactionsSender,
      isLoading,
    } = this.state;

    const combinedData = [
      ...recentTransactionsRecipient,
      ...recentTransactionsSender,
    ];

    console.log(sortingData(combinedData));

    return (
      <Card className={classes.card}>
        <CardContent className={classes.root}>
          <Typography
            variant="h6"
            component="h2"
            className={classes.typographyTitle}
          >
            <FormattedMessage {...messages.recentTransactions} />
          </Typography>

          {!isLoading ? (
            <Table className={classes.table}>
              <TableBody>
                {sortingData(combinedData).map(row => (
                  <TableRow key={row.id}>
                    {row.id_sender === 1 ? (
                      <Fragment>
                        <TableCell
                          className={classes.tableCell}
                          component="th"
                          scope="row"
                        >
                          Dla {row.id_recipient}
                          <br />
                          {row.transfer_title}
                        </TableCell>
                        <TableCell className={classes.tableCell} numeric>
                          {row.data_time}
                          <br />
                          <span className={classes.outgoingTransfer}>
                            -{row.amount_money} PLN
                          </span>
                        </TableCell>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <TableCell
                          className={classes.tableCell}
                          component="th"
                          scope="row"
                        >
                          Od {row.id_sender}
                          <br />
                          {row.transfer_title}
                        </TableCell>
                        <TableCell className={classes.tableCell} numeric>
                          {row.data_time}
                          <br />
                          {row.amount_money} PLN
                        </TableCell>
                      </Fragment>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className={classes.loadingCircular}>
              <LoadingCircular />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

RecentTransactions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecentTransactions);