import React, { Component, PropTypes } from 'react';
import SubmitButton from './SubmitButton';
import SchemaField from './SchemaField';
import { extend, set } from 'lodash';
import { getDefaultState } from '../utils';
import { deleteIndexFromState } from '../reducers';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    // Set the initial state
    this.setState({
      formData: getDefaultState(this.props.schema, this.props.formData),
    });
  }

  /**
   * Adds a new item
   *
   * @param object e
   */
  handleAddItem(e) {
    const newState = extend({}, this.state);
    set(newState, e.propId, e.value);
    this.setState(newState);
  }

  /**
   * Deletes an existing item
   *
   * @param object e
   */
  handleDeleteItem(e) {
    const payload = {
      index: e.propIndex,
      path: e.propId,
    };
    const newState = deleteIndexFromState(this.state, payload);
    this.setState(newState);
  }

  /**
   * Handles a field change
   *
   * @param object e
   */
  handleFieldChange(e) {
    const newState = extend({}, this.state);
    set(newState, e.propId, e.value);
    this.setState(newState);
  }

  /**
   * Checks required fields and executes the onSubmit callback function
   *
   * @param Event e
   */
  handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    // check required fields
    if (this.props.schema.required && this.props.schema.required.length) {
      this.props.schema.required.forEach(key => {
        // if the required fields are empty
        if (!this.state.formData[key]) {
          errors.push(key);
        }
      });
    }
    if (errors.length) {
      // execute the onError callback
      if (this.props.onError) {
        this.props.onError.call(this, errors);
      }
    }
    // execute the onSubmit callback
    if (this.props.onSubmit) {
      this.props.onSubmit.call(this, e);
    }
  }

  render() {
    const { schema } = this.props;
    const { formData } = this.state;
    return (
      <form onSubmit={::this.handleSubmit}>
        <SchemaField
          schema={schema}
          formData={formData}
          onChange={::this.handleFieldChange}
          onAddItem={::this.handleAddItem}
          onDeleteItem={::this.handleDeleteItem}
        />
        <SubmitButton>Submit</SubmitButton>
      </form>
    );
  }
}

Form.propTypes = {
  schema: PropTypes.object,
  formData: PropTypes.object,
  onError: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form;