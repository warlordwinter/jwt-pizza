# Incident: YYYY-MM-DD HH-mm-ss

## Summary

```md
Between 10:00-11:00 my server was hit with a pizza order error where the order router was no longer able to create effective orders. This caused an increase in failed pizzas and an inability to function as a business.
```

## Detection

```md
This incident was detected when the Grafana on call was triggered and Wiley were paged.

Wiley was unable to responed imediately because he was in class so he went an met with Jacob Trader after class to find the error.

We fixed our factory logger to help us detect when errors like this are occuring in the future. That way we can detect them quicker.
```

## Impact

`````md
**EXAMPLE**:

from 10:00-11:00 our server was down. There were no users affected by this and damage was minamal.

## Timeline

````md
All times are MST.

- _10:03_ - Server latency increased and factory failed. Team was notified
- _10:30_ - Wiley was on the scene repairing the problem
- _11:30_ - Wiley and Jacob were able to solve the issue.

## Response

```md
Wiley was on call. They responded in two parts. They examined the grafana logs and found the issue
```
````
`````

````

## Root cause

> [!NOTE]
> Note the final root cause of the incident, the thing identified that needs to change in order to prevent this class of incident from happening again.

```md
root cause was the pizza factory method creating pizzas.
```

## Resolution

> [!NOTE]
> Describe how the service was restored and the incident was deemed over. Detail how the service was successfully restored and you knew how what steps you needed to take to recovery.
> Depending on the scenario, consider these questions: How could you improve time to mitigation? How could you have cut that time by half?

```md
This issue we resolved by clicking on a URL endpoint which sent a signal to the factory which ended the problem.
```

## Prevention
```md
In the future we will remove pizza sabotaging ports
```

## Action items

> [!NOTE]
> Describe the corrective action ordered to prevent this class of incident in the future. Note who is responsible and when they have to complete the work and where that work is being tracked.

```md
**EXAMPLE**:
We will remove he dangerous code from our servers and github memory to protect our info.
```
````
