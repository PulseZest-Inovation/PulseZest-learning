import styled from 'styled-components';

const BenefitsContainer = styled.div`
  background-color: #0b0b45;
  padding: 50px;
  color: white;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const BenefitCard = styled.div`
  background-color: #74FF5A;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
`;

const Emoji = styled.span`
  font-size: 1.5rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.2rem;
  color: #fffff;
  margin: 0;
  font-weight: bold;
`;

const BenefitDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #fffff;
  font-weight: bold
`;

const BenefitsSection = () => {
  return (
    <BenefitsContainer>
      <Title>Job bootcamp benefits</Title>
      <BenefitsGrid>
        <BenefitCard>
          <Emoji>👨‍🏫</Emoji>
          <BenefitTitle>1:1 expert session</BenefitTitle>
          <BenefitDescription>Connects theoretical understanding with practical implementation through their insights</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Emoji>👨‍🎓</Emoji>
          <BenefitTitle>Expert faculty with 15+ yrs of experience</BenefitTitle>
          <BenefitDescription>Top-tier education enriched by practical knowledge and innovation</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Emoji>💡</Emoji>
          <BenefitTitle>Case studies to make you job ready</BenefitTitle>
          <BenefitDescription>Hands-on learning to spark creative problem-solving</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Emoji>🤔</Emoji>
          <BenefitTitle>Quick doubt support</BenefitTitle>
          <BenefitDescription>Personalised assistance for a clear understanding of concepts</BenefitDescription>
        </BenefitCard>
        <BenefitCard>
          <Emoji>📚</Emoji>
          <BenefitTitle>Live classes</BenefitTitle>
          <BenefitDescription>Learn by practice with instant feedback</BenefitDescription>
        </BenefitCard>
      </BenefitsGrid>
    </BenefitsContainer>
  );
};

export default BenefitsSection;
