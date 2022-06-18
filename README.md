# Website of CROP-leaderboard: a standardized certified adversarial robustness benchmark of RL algorithms

**Leaderboard website**: [https://crop-leaderboard.github.io](https://crop-leaderboard.github.io)

**Model Zoo**: [https://github.com/RobustBench/robustbench](https://github.com/RobustBench/robustbench)

**Paper:** [https://arxiv.org/abs/2106.09292](https://arxiv.org/abs/2106.09292)


## Main idea
  
The goal of **`CROP-leaderboard`** is to systematically track the *real* progress in certified adversarial robustness of RL algorithms. 
There are already thousands of papers on this topic, but it is still unclear which approaches really work and which only lead to [overestimated robustness](https://arxiv.org/abs/1802.00420).
We start from benchmarking the CROP-LoAct, CROP-GRe, and CROP-LoRe proposed by our paper in [different OpneAI gym environments](https://gym.openai.com). 

Evaluation of the certified robustness to adversarial attacks in Reinforcement Learning *in general* is not straightforward and our methods can provide a reasonable tight lower bound of different RL algorithms under attacks. 
Thus, in order to establish a reliable *standardized* benchmark, we need to impose some restrictions on the defenses we consider.
In particular, **we accept only defenses that are (1) have in general non-zero gradients wrt the inputs, (2) have a fully deterministic forward pass (i.e. no randomness) that
(3) does not have an optimization loop.** Often, defenses that violate these 3 principles only make gradient-based attacks 
harder but do not substantially improve robustness ([Carlini et al., (2019)](https://arxiv.org/abs/1902.06705)) except those
that can present concrete provable guarantees (e.g. [Cohen et al., (2019)](https://arxiv.org/abs/1902.02918)).

## Contributions
Contributions both to the website and [model zoo](https://github.com/RobustBench/robustbench) are very welcome, as well as any suggestions for improving the project! We would be happy to hear any feedback on how to make it better and more comprehensive.
