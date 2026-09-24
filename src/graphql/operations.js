import { gql } from '@apollo/client';

export const GET_SECTIONS = gql`
  query GetSections {
    sections {
      id
      title
      imageUrl
      size
      linkUrl
    }
  }
`;

const COLLECTION_FIELDS = gql`
  fragment CollectionFields on Collection {
    id
    title
    routeName
    items {
      id
      name
      price
      imageUrl
    }
  }
`;

export const GET_COLLECTIONS = gql`
  ${COLLECTION_FIELDS}
  query GetCollections {
    collections {
      ...CollectionFields
    }
  }
`;

export const GET_COLLECTION = gql`
  ${COLLECTION_FIELDS}
  query GetCollection($routeName: String!) {
    collection(routeName: $routeName) {
      ...CollectionFields
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($items: [CartItemInput!]!) {
    createPaymentIntent(items: $items) {
      clientSecret
      amount
    }
  }
`;
