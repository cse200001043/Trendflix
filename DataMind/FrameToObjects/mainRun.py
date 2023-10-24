from FrameToObjects import removeBackground as step1
from FrameToObjects import cropSingleObject as step2
from FrameToObjects import cropMultipleObjects as step3
from FrameToObjects import blurFace as step4


def main():
    print("Removing Backgroung\n----------------------------------------------------------------------------\n")
    step1.removeBackground()
    print("Detecting Object\n----------------------------------------------------------------------------\n")
    step2.cropSingleObject()
    print("Blurring the Face\n----------------------------------------------------------------------------\n")
    step4.blurFace()
    print("Wearable Detection Completed\n----------------------------------------------------------------------------\n")
    return 1


# if __name__ == "__main__":
#     print(main())
