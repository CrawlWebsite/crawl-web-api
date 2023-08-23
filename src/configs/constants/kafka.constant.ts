export const KafkaConstants = () => {
  return {
    KAFKA_CONFIG: {
      CONSUMER_ID: 'auth-consumer',
    },
    KAFKA_TOPIC: {
      AUTH_VERIFY_TOKEN: 'auth.verify.token',
    },
  };
};
