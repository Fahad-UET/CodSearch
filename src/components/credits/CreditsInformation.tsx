import { creditsDeduction } from '@/services/firebase/credits';

type creditsProp = {
  creditType: keyof typeof creditsDeduction;
  classes?: string;
  requiredCredits?: string;
  item?: number;
};
const CreditsInformation = ({
  creditType,
  classes = 'text-purple-700',
  requiredCredits = 'Credits needed',
  item = 1,
}: creditsProp) => {
  return (
    <div className={classes}>
      <span className="font-semibold">
        Credits needed : {Number(creditsDeduction[creditType]) * item}
      </span>
    </div>
  );
};

export default CreditsInformation;
