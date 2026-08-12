import React from 'react';

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/\d/)) score++;
  if (password.match(/[@$!%*?&]/)) score++;

  const colors = ["bg-gray-200", "bg-red-500", "bg-yellow-500", "bg-yellow-400", "bg-green-500", "bg-green-600"];
  const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];
  const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[score]} transition-all duration-300`} 
          style={{ width: widths[score] }}
        ></div>
      </div>
      {password && score > 0 && (
        <p className="text-xs text-slate-500 mt-1">{labels[score]}</p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
