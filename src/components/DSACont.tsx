import { FC } from "react";

export const DSACont: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">DSA Contests</h1>
      <div className="flex flex-row items-center justify-center">
        <a href="https://www.codechef.com/">
          <img
            src="images/DSA/codechef.png"
            alt="CodeChef"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.codeforces.com/">
          <img
            src="images/DSA/codeforces.png"
            alt="Codeforces"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.hackerrank.com/">
          <img
            src="images/DSA/hackerrank.png"
            alt="HackerRank"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.leetcode.com/">
          <img
            src="images/DSA/leetcode.png"
            alt="LeetCode"
            className="w-20 h-20 m-4"
          />
        </a>
      </div>
    </div>
  );
};
